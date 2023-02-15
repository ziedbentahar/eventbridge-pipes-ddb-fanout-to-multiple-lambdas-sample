import { NestedStack, NestedStackProps, RemovalPolicy } from "aws-cdk-lib";
import {
  AttributeType,
  BillingMode,
  StreamViewType,
  Table,
} from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

interface DatabaseProps extends NestedStackProps {
  applicationName: string;
}

export class Database extends NestedStack {
  table: Table;

  constructor(scope: Construct, id: string, props?: DatabaseProps) {
    super(scope, id, props);

    const { applicationName } = props!;

    const tableName = `${applicationName}-db`;

    this.table = new Table(this, tableName, {
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: `Id`,
        type: AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
      tableName,
      stream: StreamViewType.NEW_IMAGE,
    });
  }
}
