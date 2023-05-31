export type State =
  | "QUEUED"
  | "PLANNING"
  | "STARTING"
  | "RUNNING"
  | "FINISHED"
  | "CANCELED"
  | "FAILED";

export type DataColumn = {
  name: string;
  type: string;
  typeSignature: {
    rawType: string;
    arguments: Array<{
      kind: string;
      value: number;
    }>;
  };
};

export type DataRow = Array<null | number | string>;

export interface DataResponse {
  id: string;
  infoUri: string;
  partialCancelUri?: string;
  nextUri?: string;
  columns?: Array<DataColumn>;
  data?: Array<DataRow>;
  stats: {
    state: State;
    queued: boolean;
    scheduled: boolean;
    nodes: number;
    totalSplits: number;
    queuedSplits: number;
    runningSplits: number;
    completedSplits: number;
    cpuTimeMillis: number;
    wallTimeMillis: number;
    queuedTimeMillis: number;
    elapsedTimeMillis: number;
    processedRows: number;
    processedBytes: number;
    physicalInputBytes: number;
    peakMemoryBytes: number;
    spilledBytes: number;
    rootStage: {
      stageId: string;
      state: string;
      done: boolean;
      nodes: number;
      totalSplits: number;
      queuedSplits: number;
      runningSplits: number;
      completedSplits: number;
      cpuTimeMillis: number;
      wallTimeMillis: number;
      processedRows: number;
      processedBytes: number;
      physicalInputBytes: number;
      failedTasks: number;
      coordinatorOnly: boolean;
      subStages: unknown[];
    };
    progressPercentage?: number;
  };
  warnings: unknown[];
  error?: {
    message: string;
    errorCode: number;
    errorName: string;
    errorType: string;
    errorLocation: {
      lineNumber: number;
      columnNumber: number;
    };
    failureInfo: {
      type: string;
      message: string;
      cause: {
        type: string;
        suppressed: unknown[];
        stack: string[];
      };
      suppressed: unknown[];
      stack: string[];
      errorLocation: {
        lineNumber: number;
        columnNumber: number;
      };
    };
  };
}
