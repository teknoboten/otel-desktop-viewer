import { SpanData } from "./api-types";

export enum SpanDataStatus {
  missing = "missing",
  present = "present",
}

export type SpanUIData = {
  depth: number;
  spanID: string;
};

export type SpanWithUIData =
  | {
      status: SpanDataStatus.present;
      spanData: SpanData;
      metadata: SpanUIData;
    }
  | {
      status: SpanDataStatus.missing;
      metadata: SpanUIData;
    };

export type SummaryWithUIData =
  | {
      hasRootSpan: true;
      rootServiceName: string;
      rootName: string;
      rootDurationString: string;
      spanCount: number;
      traceID: string;
      type: string;
    }
  | {
      hasRootSpan: false;
      spanCount: number;
      traceID: string;
      type: string;
      serviceName: string;
    };

export type SidebarData = {
  numNewTraces: number;
  summaries: SummaryWithUIData[];
};

export type ModifierKey = "Alt" | "Control" | "Meta" | "Shift";
