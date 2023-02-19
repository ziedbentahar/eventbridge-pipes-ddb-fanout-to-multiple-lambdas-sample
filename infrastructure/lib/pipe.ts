import { NestedStack, NestedStackProps } from "aws-cdk-lib";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { EventBus } from "aws-cdk-lib/aws-events";
import {
  Effect,
  PolicyDocument,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from "aws-cdk-lib/aws-iam";
import { CfnPipe } from "aws-cdk-lib/aws-pipes";
import { Construct } from "constructs";

interface PipeProps extends NestedStackProps {
  applicationName: string;
  targetEventBus: EventBus;
  sourceDb: Table;
}

export class Pipe extends NestedStack {
  constructor(scope: Construct, id: string, props?: PipeProps) {
    super(scope, id, props);

    const { applicationName, targetEventBus, sourceDb } = props!;

    const pipeName = `${applicationName}-pipe`;

    const targetPolicy = new PolicyDocument({
      statements: [
        new PolicyStatement({
          resources: [targetEventBus.eventBusArn],
          actions: ["events:PutEvents"],
          effect: Effect.ALLOW,
        }),
      ],
    });

    const sourcePolicy = new PolicyDocument({
      statements: [
        new PolicyStatement({
          resources: [sourceDb.tableStreamArn!],
          actions: [
            "dynamodb:DescribeStream",
            "dynamodb:GetRecords",
            "dynamodb:GetShardIterator",
            "dynamodb:ListStreams",
          ],
          effect: Effect.ALLOW,
        }),
      ],
    });

    const pipeRole = new Role(this, "role", {
      assumedBy: new ServicePrincipal("pipes.amazonaws.com"),
      inlinePolicies: {
        sourcePolicy,
        targetPolicy,
      },
    });

    const pipe = new CfnPipe(this, "pipe", {
      name: pipeName,
      roleArn: pipeRole.roleArn,
      source: sourceDb.tableStreamArn!,

      sourceParameters: {
        dynamoDbStreamParameters: {
          startingPosition: "LATEST",
        },
      },
      target: targetEventBus.eventBusArn,
      targetParameters: {
        inputTemplate: `{
          "id": <$.dynamodb.NewImage.Id.S>,
          "email": <$.dynamodb.NewImage.email.S>,
          "message": <$.dynamodb.NewImage.message.S>,
          "product": <$.dynamodb.NewImage.product.S>,
          "serviceRate": <$.dynamodb.NewImage.serviceRate.N>
        }`,
      },
    });
  }
}
