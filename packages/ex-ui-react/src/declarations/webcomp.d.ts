import * as React from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "hdml-io": HdmlIoProps;
      "hdml-model": HdmlModelProps;
    }
  }
}

interface HdmlIoProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement>,
    HTMLElement
  > {
  name: string;
  host: string;
  tenant: string;
  token: string;
}

interface HdmlModelProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement>,
    HTMLElement
  > {
  name: string;
}
