export type HeaderKey =
  | "USER"
  | "SOURCE"
  | "CATALOG"
  | "SCHEMA"
  | "TIME_ZONE"
  | "CURRENT_STATE"
  | "MAX_WAIT"
  | "MAX_SIZE"
  | "PAGE_SEQUENCE_ID"
  | "SESSION"
  | "PREPARE"
  | "USER_AGENT"
  | "AUTHORIZATION";

export type HeaderValue =
  // presto
  | "X-Presto-User"
  | "X-Presto-Source"
  | "X-Presto-Catalog"
  | "X-Presto-Schema"
  | "X-Presto-Time-Zone"
  | "X-Presto-Current-State"
  | "X-Presto-Max-Wait"
  | "X-Presto-Max-Size"
  | "X-Presto-Page-Sequence-Id"
  | "X-Presto-Session"
  | "X-Presto-Prepared-Statement"
  // trino
  | "X-Trino-User"
  | "X-Trino-Source"
  | "X-Trino-Catalog"
  | "X-Trino-Schema"
  | "X-Trino-Time-Zone"
  | "X-Trino-Current-State"
  | "X-Trino-Max-Wait"
  | "X-Trino-Max-Size"
  | "X-Trino-Page-Sequence-Id"
  | "X-Trino-Session"
  | "X-Trino-Prepared-Statement"
  // common
  | "User-Agent"
  | "Authorization";

export type HeadersDict = {
  [header in HeaderKey]: HeaderValue;
};

export type Headers = {
  [header in HeaderValue]?: string;
};

export const PrestoHeaders: HeadersDict = {
  USER: "X-Presto-User",
  SOURCE: "X-Presto-Source",
  CATALOG: "X-Presto-Catalog",
  SCHEMA: "X-Presto-Schema",
  TIME_ZONE: "X-Presto-Time-Zone",
  CURRENT_STATE: "X-Presto-Current-State",
  MAX_WAIT: "X-Presto-Max-Wait",
  MAX_SIZE: "X-Presto-Max-Size",
  PAGE_SEQUENCE_ID: "X-Presto-Page-Sequence-Id",
  SESSION: "X-Presto-Session",
  PREPARE: "X-Presto-Prepared-Statement",
  USER_AGENT: "User-Agent",
  AUTHORIZATION: "Authorization",
};

export const TrinoHeaders: HeadersDict = {
  USER: "X-Trino-User",
  SOURCE: "X-Trino-Source",
  CATALOG: "X-Trino-Catalog",
  SCHEMA: "X-Trino-Schema",
  TIME_ZONE: "X-Trino-Time-Zone",
  CURRENT_STATE: "X-Trino-Current-State",
  MAX_WAIT: "X-Trino-Max-Wait",
  MAX_SIZE: "X-Trino-Max-Size",
  PAGE_SEQUENCE_ID: "X-Trino-Page-Sequence-Id",
  SESSION: "X-Trino-Session",
  PREPARE: "X-Trino-Prepared-Statement",
  USER_AGENT: "User-Agent",
  AUTHORIZATION: "Authorization",
};
