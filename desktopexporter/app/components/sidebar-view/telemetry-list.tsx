import React, { useEffect, useRef } from "react";
import { FixedSizeList } from "react-window";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Flex,
  LinkBox,
  LinkOverlay,
  Divider,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useSize } from "@chakra-ui/react-use-size";

import { SummaryWithUIData } from "../../types/ui-types";
import { useKeyCombo, useKeyPress } from "../../utils/use-key-press";
import { KeyboardHelp } from "../modals/keyboard-help";

const sidebarSummaryHeight = 120;
const dividerHeight = 1;

type SidebarRowData = {
  selectedTraceID: string;
  summaries: SummaryWithUIData[];
};

type SidebarRowProps = {
  index: number;
  style: Object;
  data: SidebarRowData;
};

function SidebarRow({ index, style, data }: SidebarRowProps) {
  let selectedColor = useColorModeValue("pink.100", "pink.900");
  let dividerColour = useColorModeValue("blackAlpha.300", "whiteAlpha.300");
  let { selectedTraceID, summaries } = data;
  let traceSummary = summaries[index];

  let isSelected =
    selectedTraceID && selectedTraceID === traceSummary.traceID ? true : false;

  let backgroundColour = isSelected ? selectedColor : "";

  if (traceSummary.hasRootSpan) {
    // Add zero-width space after forward slashes, dashes, and dots
    // to indicate line breaking opportunity
    let rootNameLabel = traceSummary.rootName
      .replaceAll("/", "/\u200B")
      .replaceAll("-", "-\u200B")
      .replaceAll(".", ".\u200B");

    let rootServiceNameLabel = traceSummary.rootServiceName
      .replaceAll("/", "/\u200B")
      .replaceAll("-", "-\u200B")
      .replaceAll(".", ".\u200B");

    return (
      <div style={style}>
        <Divider
          height={dividerHeight}
          borderColor={dividerColour}
        />
        <LinkBox
          display="flex"
          flexDirection="column"
          justifyContent="center"
          bgColor={backgroundColour}
          height={`${sidebarSummaryHeight}px`}
          paddingX="20px"
        >
          <Text
            fontSize="xs"
            noOfLines={1}
          >
            {"Root Service Name: "}
            <strong>{rootServiceNameLabel}</strong>
          </Text>
          <Text
            fontSize="xs"
            noOfLines={2}
          >
            {"Root Name: "}
            <strong>{rootNameLabel}</strong>
          </Text>
          <Text fontSize="xs">
            {"Root Duration: "}
            <strong>{traceSummary.rootDurationString}</strong>
          </Text>
          <Text fontSize="xs">
            {"Number of Spans: "}
            <strong>{traceSummary.spanCount}</strong>
          </Text>
          <LinkOverlay
            as={NavLink}
            to={`telemetry/${traceSummary.traceID}`}
          >
            <Text fontSize="xs">
              {"Trace ID: "}
              <strong>{traceSummary.traceID}</strong>
            </Text>
          </LinkOverlay>
        </LinkBox>
      </div>
    );
  }

  if (traceSummary.type === "trace") {
    return (
      <div style={style}>
        <Divider
          height={dividerHeight}
          borderColor={dividerColour}
        />
        <LinkBox
          display="flex"
          flexDirection="column"
          justifyContent="center"
          bgColor={backgroundColour}
          height={`${sidebarSummaryHeight}px`}
          paddingX="20px"
        >
          <Text fontSize="xs">
            {"Incomplete Trace: "}
            <strong>{"missing a root span"}</strong>
          </Text>
          <Text fontSize="xs">
            {"Number of Spans: "}
            <strong>{traceSummary.spanCount}</strong>
          </Text>
          <LinkOverlay
            as={NavLink}
            to={`telemetry/${traceSummary.traceID}`}
          >
            <Text fontSize="xs">
              {"Trace ID: "}
              <strong>{traceSummary.traceID}</strong>
            </Text>
          </LinkOverlay>
        </LinkBox>
      </div>
    );
  }

  return (
    <div style={style}>
      <Divider
        height={dividerHeight}
        borderColor={dividerColour}
      />
      <LinkBox
        display="flex"
        flexDirection="column"
        justifyContent="center"
        bgColor={backgroundColour}
        height={`${sidebarSummaryHeight}px`}
        paddingX="20px"
      >
        <LinkOverlay
          as={NavLink}
          to={`telemetry/${traceSummary.traceID}`}
        >
          <Text fontSize="xs">
            {"Service Name: "}
            <strong>{"log service name"}</strong>
          </Text>
          <Text fontSize="xs">
            {"Useful Log Data: "}
            <strong>Severity or something</strong>
          </Text>
          <Text fontSize="xs">
            {"Trace ID: "}
            <strong>{traceSummary.traceID}</strong>
          </Text>
        </LinkOverlay>
      </LinkBox>
    </div>
  );
}

type TelemetryListProps = {
  summaries: SummaryWithUIData[];
};

export function TelemetryList(props: TelemetryListProps) {
  let containerRef = useRef(null);
  let summaryListRef = React.createRef<FixedSizeList>();
  let size = useSize(containerRef);

  let location = useLocation();
  let navigate = useNavigate();

  let { isOpen, onOpen, onClose } = useDisclosure();

  let selectedIndex = 0;
  let selectedTraceID = "";
  let { summaries } = props;

  // // Default to the first trace in the list if none are selected
  if (location.pathname.includes("/telemetry/")) {
    selectedTraceID = location.pathname.split("/")[2];
    selectedIndex = summaries.findIndex(
      (summary) => summary.traceID === selectedTraceID,
    );
  } else {
    selectedTraceID = summaries[selectedIndex].traceID;
    window.location.href = `/telemetry/${selectedTraceID}`;
  }

  // Scroll to the currently selected trace summary on load
  useEffect(() => {
    summaryListRef.current?.scrollToItem(selectedIndex, "start");
  }, []);

  // Set up keyboard navigation
  let prevTraceKeyPressed = useKeyPress(["ArrowLeft", "h"]);
  let nextTraceKeyPressed = useKeyPress(["ArrowRight", "l"]);
  let reloadKeyPressed = useKeyPress(["r"]);
  let navHelpComboPressed = useKeyCombo(["Shift"], ["?"]);
  let clearTracesComboPressed = useKeyCombo(["Control"], ["l"]);

  // Navigate to previous trace
  useEffect(() => {
    if (prevTraceKeyPressed) {
      selectedIndex = selectedIndex > 0 ? selectedIndex - 1 : 0;
      summaryListRef.current?.scrollToItem(selectedIndex);

      selectedTraceID = summaries[selectedIndex].traceID;
      navigate(`/telemetry/${selectedTraceID}`);
    }
  }, [prevTraceKeyPressed]);

  // Navigate to next trace
  useEffect(() => {
    if (nextTraceKeyPressed) {
      selectedIndex =
        selectedIndex < summaries.length - 1
          ? selectedIndex + 1
          : summaries.length - 1;
      summaryListRef.current?.scrollToItem(selectedIndex);

      selectedTraceID = summaries[selectedIndex].traceID;
      navigate(`/telemetry/${selectedTraceID}`);
    }
  }, [nextTraceKeyPressed]);

  // Reload current window
  useEffect(() => {
    if (reloadKeyPressed) {
      window.location.reload();
    }
  }, [reloadKeyPressed]);

  // Show the keyboard navigation help modal
  useEffect(() => {
    if (navHelpComboPressed) {
      onOpen();
    }
  }, [navHelpComboPressed]);

  // Clear current traces
  useEffect(() => {
    if (clearTracesComboPressed) {
      clearTraceData();
    }
  }, [clearTracesComboPressed]);

  let itemData = {
    selectedTraceID: selectedTraceID,
    summaries: summaries,
  };

  let itemHeight = sidebarSummaryHeight + dividerHeight;

  return (
    <Flex
      ref={containerRef}
      height="100%"
    >
      <FixedSizeList
        height={size ? size.height : 0}
        itemData={itemData}
        itemCount={props.summaries.length}
        itemSize={itemHeight}
        width="100%"
        ref={summaryListRef}
      >
        {SidebarRow}
      </FixedSizeList>
      <KeyboardHelp
        isOpen={isOpen}
        onClose={onClose}
      />
    </Flex>
  );
}

export async function clearTraceData() {
  let response = await fetch("/api/clearData");
  if (!response.ok) {
    throw new Error("HTTP status " + response.status);
  } else {
    window.location.replace("/");
  }
}
