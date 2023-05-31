import { Agent as HttpAgent, request as HttpRequest } from "http";
import { Agent as HttpsAgent, request as HttpsRequest } from "https";

export type AdapterAgent = typeof HttpAgent | typeof HttpsAgent;

export type AdapterRequest = typeof HttpRequest | typeof HttpsRequest;

export interface Adapter {
  Agent: AdapterAgent;
  request: typeof HttpRequest | typeof HttpsRequest;
}

export function getAdapter(protocol: string): Adapter {
  switch (protocol) {
    case "http:":
      return {
        Agent: HttpAgent,
        request: HttpRequest,
      };
    case "https:":
      return {
        Agent: HttpsAgent,
        request: HttpsRequest,
      };
    default:
      throw new Error(`Unsupported protocol value: ${protocol}`);
  }
}
