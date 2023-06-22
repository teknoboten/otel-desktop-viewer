import React, { useRef, CSSProperties } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Flex,
  Text,
  useColorModeValue,
  LinkBox,
  LinkOverlay,
  Heading,
} from "@chakra-ui/react";
import { LogData, ResourceData } from "../../types/api-types";

type LogWaterfallViewProps = {
  log: LogData;
};

export function LogWaterfallView({ log }: LogWaterfallViewProps) {
  let resource = { ...log.resource } as ResourceData;
  let attributes = { ...resource.attributes };

  let {
    traceID,
    body,
    severityText,
    severityNumber,
    droppedAttributeCount,
    timestamp,
    observedTimestamp,
  } = log;

  const waterfallItemHeight = 20;
  const nameColumnWidth = 300;
  const bodyColumnWidth = 300;
  const severityColumnWidth = 100;
  const timestampColumnWidth = 300;

  return (
    <div>
      <LinkBox
        justifyContent="space-between"
        display="flex"
        height={waterfallItemHeight}
        paddingX="10px"
        paddingTop="10px"
        bgColor={useColorModeValue("pink.400", "pink.900")}
        rounded="md"
      >
        <LinkOverlay href={`/telemetry/${traceID}`}>
          <Flex
            direction="column"
            width={nameColumnWidth}
          >
            <Heading
              paddingX={2}
              size="sm"
            >
              name
            </Heading>
            <Text
              paddingX={2}
              size="sm"
            >
              {attributes[`service.name`]}
            </Text>
          </Flex>
        </LinkOverlay>

        <Flex
          width={bodyColumnWidth}
          direction="column"
        >
          <Heading
            paddingX={1}
            size="sm"
          >
            body
          </Heading>
          <Text
            paddingX={1}
            size="sm"
          >
            {body}
          </Text>
        </Flex>

        <Flex
          direction="column"
          width={severityColumnWidth}
        >
          <Heading
            paddingX={1}
            size="sm"
          >
            severity
          </Heading>
          <Text
            paddingX={1}
            size="sm"
          >
            {severityText}
          </Text>
        </Flex>

        <Flex
          direction="column"
          width={timestampColumnWidth}
        >
          <Heading
            paddingX={1}
            size="sm"
          >
            timestamp
          </Heading>
          <Text
            paddingX={1}
            size="sm"
          >
            {timestamp}
          </Text>
        </Flex>
      </LinkBox>
    </div>
  );
}
