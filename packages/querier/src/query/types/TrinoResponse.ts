export type Column = {
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

export type Row = Array<null | number | string>;

export interface TrinoResponse {
  id: string;
  infoUri: string;
  partialCancelUri?: string;
  nextUri?: string;
  columns?: Array<Column>;
  data?: Array<Row>;
  stats: {
    state: "QUEUED" | "FAILED" | "RUNNING" | "FINISHED";
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
