class Statement extends Readable {
    /**
     * @description constructor for Statement class, used to manage a single execution of a Presto query.
     * @param {Object} readableOptions - optional parameters highWaterMark, objectMode. (other Readable options are fixed)
     * @param {Client} client - related presto client
     * @param {String} initialUri - the first uri to fetch data from (provided by client)
     * @param {String} queryid - the query ID
     * @param {Boolean} fetchInfo - whether to retrieve Info on success event or not
     * @param {Number} pollInterval - milliseconds to poll for state changes
     * @param {String} session - related session data
     */
    constructor(readableOptions,client,initialUri,queryId,fetchInfo = false,pollInterval = QUERY_STATE_CHECK_INTERVAL,session = null){
        const opts = {objectMode:false,autoDestroy:true};
        if(readableOptions.highWaterMark) {
            opts.highWaterMark = readableOptions.highWaterMark;
        }
        if(readableOptions.hasOwnProperty('objectMode') && readableOptions.objectMode) {
            opts.objectMode = true;
        } else {
            opts.encoding = 'utf8';
        }
        super(opts);
        this[s_objectMode] = opts.objectMode; //cannot use this before super
        this[s_EOF] = false;
        this[s_SOF] = false;
        this[s_id] = queryId;
        this[s_state] = null;
        this[s_nextUri] = initialUri;
        this[s_session] = session || null;
        this[s_cancelled] = false;
        this[s_isRunning] = false;
        this.client = client;
        this.columns = null;
        this.fetchInfo = (fetchInfo) ? true : false;
        this[s_handleError] = (err)=>{
            //end run if error, and attempt to cancel on Presto as well
            this.emit('error',err);
            this.cancel().catch((error)=>{ // if call to cancel errors, emit that error
                this.emit('error',error);
            });
            this[s_isRunning] = false;
        };
    }
    /**
     * @description returns the query ID related to this statement
     */
    get query_id() {
        return this[s_id];
    }
    /**
     * @description get the currrent state of the query.
     */
    get state() {
        return this[s_state];
    }
    /**
     * @description get the session for re-use
     */
    get session() {
        return this[s_session];
    }
    /**
     * @description cancel the running query.
     */
    async cancel() {
        this[s_cancelled] = true; //flag to stop
        this[s_nextUri] = null;
        return await this.client.kill(this[s_id]);
    }
    /**
     * @description Internal, required as a Readable implementation
     */
    _read() {
        if (!this[s_isRunning]) {
            this._run();
        }
    }
    /**
     * @description Internal, required as a Readable implementation
     */
    _destroy(error,callback) {
        if(!['FINISHED', 'CANCELED', 'FAILED'].includes(this[s_state])) {
            //cancel query if it is still running on server
            this.cancel().then(()=>{
                this.client = null;
                return callback(null);
            },(err)=>{
                this.client = null;
                return callback(err);
            });
        } else {
            this[s_nextUri] = null;
            this.client = null;
        }
    }

    _statementCancelled(){
        if(this[s_cancelled]) { //check if cancelled before doing anything else.
            if(!this[s_EOF]) { //if not yet reached EOF push null to signal EOF
                this[s_EOF] = true;
                this.push(null);
            }
            return true;  //notify to  end run if cancelled
        }
        return false;
    }
    /**
     * @description. Internal. fetches packets of data from Presto
     */
    _run() {
        this[s_isRunning] = true;
        const requestOpts = { path: this[s_nextUri] };
        if(this[s_session]) {
            requestOpts.session = this[s_session];
        }
        if(this._statementCancelled()){
            this[s_isRunning] = false;
            return; //check before request to presto to avoid an unnecessary call to presto server
        }
        this.client[s_request](requestOpts,(err,response)=>{
            if(err) {
                return this[s_handleError](err);
            } else if (!response || typeof response !== 'object') {
                return this[s_handleError](new prestoError('strange response from Presto',response));
            }
            const { response_code , data , session , clear_session} = response;
            if(this._statementCancelled()){
                this[s_isRunning] = false;
                return; //check again after request since request runs async and a call to cancel may have occured in the interim
            }
            if(session){
                this[s_session] = session;
            } else if (clear_session) {
                this[s_session] = null;
            }
            /*
            * 1st time
                {
                "stats": {
                "rootStage": {
                    "subStages": [
                    {
                        "subStages": [],
                        "processedBytes": 83103149, "processedRows": 2532704,
                        "wallTimeMillis": 20502, "cpuTimeMillis": 3431, "userTimeMillis": 3210,
                        "stageId": "1", "state": "FINISHED", "done": true,
                        "nodes": 3,
                        "totalSplits": 420, "queuedSplits": 0, "runningSplits": 0, "completedSplits": 420
                    }
                    ],
                    // same as substage
                },
                // same as substage
                "state": "RUNNING",
                },
                "data": [ [ 1266352 ] ],
                "columns": [ { "type": "bigint", "name": "cnt" } ],
                "nextUri": "http://localhost:8080/v1/statement/20140120_032523_00000_32v8g/2",
                "partialCancelUri": "http://10.0.0.0:8080/v1/stage/20140120_032523_00000_32v8g.0",
                "infoUri": "http://localhost:8080/v1/query/20140120_032523_00000_32v8g",
                "id": "20140120_032523_00000_32v8g"
                }
            * 2nd time
                    {
                    "stats": {
                    // ....
                    "state": "FINISHED",
                    },
                    "columns": [ { "type": "bigint", "name": "cnt" } ],
                    "infoUri": "http://localhost:8080/v1/query/20140120_032523_00000_32v8g",
                    "id": "20140120_032523_00000_32v8g"
                    }
            */
            if(data.error) {
                if (data.error.message) {
                    return this[s_handleError](new prestoError(data.error.message,{ response_code , data }));
                } else {
                    return this[s_handleError](new prestoError('attempt to retrieve next dataUri failed',{ response_code, data }));
                }
            }

            if(this.listenerCount('state') > 0 && !this[s_SOF]) { //only emit state event if something is listening & file has not started downloading
                this.emit('state',data.stats.state,data.stats);
            }
            if(this[s_state] !== data.stats.state) {
                this[s_state] = data.stats.state;
                this.emit('state_change',data.stats.state,data.stats);
                if(this[s_state] === 'FINISHED') {
                    this[s_SOF] = true;
                }
            }
            /* presto-main/src/main/java/com/facebook/presto/execution/QueryState.java
            * QUEUED, PLANNING, STARTING, RUNNING, FINISHED, CANCELED, FAILED
            */
            if ((data.stats.state === 'QUEUED' || data.stats.state === 'PLANNING'
                || data.stats.state === 'STARTING' || data.stats.state === 'RUNNING')
            && !data.data) {
                this[s_nextUri] = data.nextUri;
                //currently waiting for the query to finish. wait pollInterval frequency and run again.
                return setTimeout(()=>{ this._run(); },this.pollInterval);
            }
            let canPush = true; //keep track whether downstream can receive data
            if(!this.columns && data.columns) {
                this.columns = data.columns;
                this.emit('columns',data.columns);
                if(this[s_objectMode]) { //object mode, guarantee uniqueness of column names
                    const uniqueColumns = new Set(); const duplicates = {};
                    this.columns.forEach((column)=>{
                        if(uniqueColumns.has(column.name)) {
                            duplicates[column.name] = 1;
                        } else {
                            uniqueColumns.add(column.name);
                        }
                    });
                    if(Object.keys(duplicates).length > 0) { //only run if duplicates detected
                        for (let i = 0; i < this.columns.length; i++) {
                            const colName = this.columns[i].name;
                            if(duplicates.hasOwnProperty(colName)) {
                                this.columns[i].name += '_' + duplicates[colName];
                                duplicates[colName]++;
                            }
                        }
                    }
                } else { //not object mode, push out CSV header
                    canPush = this.push(this.columns.map(i=>convertToCSV(i.name,this.client.jsonParser)).join(',') + '\n');
                }
            }
            if (data.data) {
                if(this[s_objectMode]) {  //if object mode, push out object in form column name: value
                    //push data received in this request row by row as objects
                    //since data is received in bulk it has to be buffered in memory one way or another, so push it all
                    // however keep track whether canPush more, to either stop before next request or keep going immediately
                    for (let i = 0; i < data.data.length; i++) {
                        const output = {};
                        for(let y = 0; y < this.columns.length; y++) {
                            output[this.columns[y].name] = data.data[i][y];
                        }
                        canPush = this.push(output);
                    }
                } else { //when data is being sent in string mode, send the entire response data as a string in one push
                    canPush = this.push(data.data.map(i => i.map(y => convertToCSV(y,this.client.jsonParser)).join(',')).join('\n') + '\n');
                }
            }
            if(data.nextUri) {
                this[s_nextUri] = data.nextUri;
                if(canPush) { //if not too much pressure on writeStream, get the next value without waiting.
                    return this._run();
                } else {
                    this[s_isRunning] = false;
                    return;
                }
            } else {
                //if no nextUri, reached end of datastream.
                // if not already done (from cancellation) push null to signal EOF.
                if(!this[s_EOF]) {
                    this[s_EOF] = true;
                    this.push(null);
                }
                if(this.fetchInfo && data.infoUri) {
                    //const {hostname:ihost , iport, pathname:ipath} = new URL(data.infoUri);
                    //const { data : info } = await this.client.request({host:ihost , port:iport , path:ipath });
                    this.client[s_request]({ path : data.infoUri}).then(({ data : info })=>{
                        this.emit('success',{ stats: data.stats , info });
                    },(error)=>{
                        this.emit('success',{stats: data.stats ,info:{error:error}});
                    });
                } else {
                    this.emit('success',data.stats);
                }
                this[s_isRunning] = false;
                return;
            }
        });
    }
}