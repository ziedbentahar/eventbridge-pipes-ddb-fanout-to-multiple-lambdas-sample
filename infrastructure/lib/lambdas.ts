import { Duration, NestedStack, NestedStackProps } from "aws-cdk-lib";
import { EventBus, Match, Rule } from "aws-cdk-lib/aws-events";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";
import { Architecture, Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";
const resolve = require("path").resolve;

interface LambdasProps extends NestedStackProps {
  applicationName: string;
  eventBus: EventBus;
}

export class Lambdas extends NestedStack {
  constructor(scope: Construct, id: string, props?: LambdasProps) {
    super(scope, id, props);

    const { applicationName, eventBus } = props!;

    const lambdaConfig = {
      memorySize: 128,
      timeout: Duration.seconds(10),
      runtime: Runtime.NODEJS_18_X,
      architecture: Architecture.ARM_64,
      logRetention: RetentionDays.THREE_DAYS,
      environment: {
        NODE_OPTIONS: "--enable-source-maps",
      },
    };

    const dest1 = new NodejsFunction(this, `applicationName-lambda-dest-1`, {
      entry: resolve("../src/lambdas/lambda-dest-1.ts"),
      functionName: `${applicationName}-lambda-dest-1`,
      handler: "handler",
      ...lambdaConfig,
    });

    const dest2 = new NodejsFunction(this, `applicationName-lambda-dest-2`, {
      entry: resolve("../src/lambdas/lambda-dest-2.ts"),
      functionName: `${applicationName}-lambda-dest-2`,
      handler: "handler",
      ...lambdaConfig,
    });

    const dest3 = new NodejsFunction(this, `applicationName-lambda-dest-3`, {
      entry: resolve("../src/lambdas/lambda-dest-3.ts"),
      functionName: `${applicationName}-lambda-dest-3`,
      handler: "handler",
      ...lambdaConfig,
    });

    new Rule(this, "ebrules", {
      eventBus: eventBus,
      targets: [dest1, dest2, dest3].map((tf) => new LambdaFunction(tf)),
      eventPattern: {
        source: Match.prefix(""),
      },
    });
  }
}
