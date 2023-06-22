import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Box,
  AccordionIcon,
  List,
  Heading,
} from "@chakra-ui/react";
import { LogData } from "../../types/api-types";
import { LogField } from "./log-field";

type LogPanelProps = {
  log: LogData | undefined;
};

export function LogDataPanel(props: LogPanelProps) {
  let { log } = props;
  if (!log) {
    return (
      <div>
        <p>Nothing here yet.</p>
      </div>
    );
  }

  //Log  Attributes:
  let logAttributes = Object.entries(log.attributes).map(([key, value]) => (
    <li key={key}>
      <LogField
        fieldName={key}
        fieldValue={value}
      />
    </li>
  ));

  let resourceAttributes = Object.entries(log.resource.attributes).map(
    ([key, value]) => (
      <li key={key}>
        <LogField
          fieldName={key}
          fieldValue={value}
        />
      </li>
    ),
  );

  let scopeAttributes = Object.entries(log.scope.attributes).map(
    ([key, value]) => (
      <li key={key}>
        <LogField
          fieldName={key}
          fieldValue={value}
        />
      </li>
    ),
  );

  return (
    <Accordion
      // defaultIndex={[0]}
      index={[0, 1, 2]}
      allowMultiple
    >
      <AccordionItem>
        <AccordionButton>
          <Box
            flex="1"
            textAlign="left"
          >
            <Heading
              lineHeight="revert"
              size="sm"
            >
              Log Data
            </Heading>
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel>
          <LogField
            fieldName="traceID"
            fieldValue={log.traceID}
          />
          <LogField
            fieldName="span id"
            fieldValue={log.spanID}
          />
          <LogField
            fieldName="timestamp"
            fieldValue={log.timestamp}
          />
          <LogField
            fieldName="observed at"
            fieldValue={log.observedTimestamp}
          />

          <LogField
            fieldName="severity number"
            fieldValue={log.severityNumber}
          />
          <LogField
            fieldName="severity message"
            fieldValue={log.severityText}
            //   hidden={span.statusCode === "Unset" || span.statusCode === "Ok"}
          />

          <List>{logAttributes}</List>
          <LogField
            fieldName="dropped attributes count"
            fieldValue={log.droppedAttributeCount}
            hidden={log.droppedAttributeCount === 0}
          />
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <AccordionButton>
          <Box
            flex="1"
            textAlign="left"
          >
            <Heading size="sm">Resource Data</Heading>
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel>
          <List>{resourceAttributes}</List>
          <LogField
            fieldName="dropped attributes count"
            fieldValue={log.resource.droppedAttributesCount}
            hidden={log.resource.droppedAttributesCount === 0}
          />
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem>
        <AccordionButton>
          <Box
            flex="1"
            textAlign="left"
          >
            <Heading size="sm">Scope Data</Heading>
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel>
          <LogField
            fieldName="scope name"
            fieldValue={log.scope.name}
          />
          <LogField
            fieldName="scope version"
            fieldValue={log.scope.version}
          />
          <List>{scopeAttributes}</List>
          <LogField
            fieldName="dropped attributes count"
            fieldValue={log.scope.droppedAttributesCount}
            hidden={log.scope.droppedAttributesCount === 0}
          />
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
