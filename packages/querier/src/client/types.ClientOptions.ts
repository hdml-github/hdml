export type ClientOptions = {
  engine: "presto" | "trino";
  host?: string;
  port?: number;
  user?: string;
  custom_auth?: string;
  basic_auth?: {
    user: string;
    password: string;
  };
  ssl?: object;
  catalog?: string;
  schema?: string;
  source?: string;
  checkInterval?: number;
  enableVerboseStateCallback?: boolean;
  jsonParser?: {
    parse: (data: string) => object;
    stringify: (data: object) => string;
  };
};
