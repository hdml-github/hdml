import { Builder } from "flatbuffers";
import { Frame, Parent } from "../.fbs/data.Frame_generated";

export type FrameData = {
  name: string;
  host: string;
  source: string;
  limit: number;
};
