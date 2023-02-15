import { Duration, NestedStack, NestedStackProps } from "aws-cdk-lib";
import { Architecture, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";
const resolve = require("path").resolve;

interface LambdasProps extends NestedStackProps {
  applicationName: string;
}

export class Lambdas extends NestedStack {
  functions: Function[];

  constructor(scope: Construct, id: string, props?: LambdasProps) {
    super(scope, id, props);

    const { applicationName } = props!;

    const lambdaConfig = {
      memorySize: 512,
      timeout: Duration.seconds(10),
      runtime: Runtime.NODEJS_18_X,
      architecture: Architecture.ARM_64,
      logRetention: RetentionDays.THREE_DAYS,
      environment: {
        NODE_OPTIONS: "--enable-source-maps",
      },
    };

    const function1 = new NodejsFunction(this, `applicationName-lambda-1`, {
      entry: resolve("../src/lambdas/lambda1.ts"),
      functionName: "lambda1",
      handler: "handler",
      ...lambdaConfig,
    });

    const function2 = new NodejsFunction(this, `applicationName-lambda-2`, {
      entry: resolve("../src/lambdas/lambda2.ts"),
      functionName: "lambda2",
      handler: "handler",
      ...lambdaConfig,
    });

    const function3 = new NodejsFunction(this, `applicationName-lambda-3`, {
      entry: resolve("../src/lambdas/lambda3.ts"),
      functionName: "lambda3",
      handler: "handler",
      ...lambdaConfig,
    });

    this.functions = [function1, function2, function3];
  }
}
