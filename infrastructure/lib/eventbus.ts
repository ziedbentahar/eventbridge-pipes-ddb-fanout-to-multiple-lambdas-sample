import { NestedStack, NestedStackProps } from "aws-cdk-lib";
import { EventBus as EventBridgeBus } from "aws-cdk-lib/aws-events";
import { Construct } from "constructs";

interface EventBusProps extends NestedStackProps {
  applicationName: string;
}

export class EventBus extends NestedStack {
  eventBus: EventBridgeBus;

  constructor(scope: Construct, id: string, props?: EventBusProps) {
    super(scope, id, props);

    const { applicationName } = props!;

    const eventBusName = `${applicationName}-eventbus`;

    this.eventBus = new EventBridgeBus(this, "event-bus", {
      eventBusName,
    });
  }
}
