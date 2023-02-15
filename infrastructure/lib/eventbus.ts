import { NestedStack, NestedStackProps } from "aws-cdk-lib";
import {
  EventBus as EventBridgeBus,
  Match,
  Rule,
} from "aws-cdk-lib/aws-events";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";
import { Function } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

interface EventBusProps extends NestedStackProps {
  applicationName: string;
  targetFunctions: Function[];
}

export class EventBus extends NestedStack {
  eventBus: EventBridgeBus;

  constructor(scope: Construct, id: string, props?: EventBusProps) {
    super(scope, id, props);

    const { applicationName, targetFunctions } = props!;

    const eventBusName = `${applicationName}-eventbus`;

    this.eventBus = new EventBridgeBus(this, "event-bus", {
      eventBusName,
    });

    const lambdaConsumerRule = new Rule(this, "ebrules", {
      eventBus: this.eventBus,
      targets: targetFunctions.map((tf) => new LambdaFunction(tf)),
      eventPattern: {
        source: Match.prefix(""),
      },
    });
  }
}
