import { NestedStack, NestedStackProps } from "aws-cdk-lib";
import {
  AwsIntegration,
  PassthroughBehavior,
  Resource,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

interface ApiGatewayProps extends NestedStackProps {
  applicationName: string;
  destinationTable: Table;
}

export class ApiGateway extends NestedStack {
  constructor(scope: Construct, id: string, props?: ApiGatewayProps) {
    super(scope, id, props);

    const { applicationName, destinationTable } = props!;

    const apigatewayName = `${applicationName}-apigateway`;

    var api = new RestApi(this, "restapi", {
      restApiName: apigatewayName,
    });
    const resource = api.root.addResource("messages");
    this.addPostMethodIntegration(destinationTable, resource);

    this.addGetMethodIntegration(destinationTable, resource);
  }

  private addPostMethodIntegration(
    destinationTable: Table,
    resource: Resource
  ) {
    const role = new Role(this, "apigtw-write-ddb", {
      assumedBy: new ServicePrincipal("apigateway.amazonaws.com"),
    });

    destinationTable.grantWriteData(role);

    const dynamoPutIntegration = new AwsIntegration({
      service: "dynamodb",
      action: "PutItem",
      options: {
        passthroughBehavior: PassthroughBehavior.NEVER,
        credentialsRole: role,
        requestTemplates: {
          "application/json": JSON.stringify({
            TableName: destinationTable.tableName,
            Item: {
              Id: { S: "$context.requestId" },
              email: { S: "$input.path('$.email')" },
              product: { S: "$input.path('$.product')" },
              serviceRate: { N: "$input.path('$.serviceRate')" },
              message: { S: "$input.path('$.message')" },
            },
          }),
        },
        integrationResponses: [
          {
            statusCode: "200",
            responseTemplates: {
              "application/json": JSON.stringify({
                id: "$context.requestId",
              }),
            },
          },
        ],
      },
    });
    resource.addMethod("POST", dynamoPutIntegration, {
      methodResponses: [{ statusCode: "200" }],
    });
  }

  private addGetMethodIntegration(destinationTable: Table, resource: Resource) {
    const role = new Role(this, "apigtw-read-ddb", {
      assumedBy: new ServicePrincipal("apigateway.amazonaws.com"),
    });

    destinationTable.grantReadData(role);

    const dynamoQueryIntegration = new AwsIntegration({
      service: "dynamodb",
      action: "Query",
      options: {
        passthroughBehavior: PassthroughBehavior.NEVER,
        credentialsRole: role,
        requestParameters: {
          "integration.request.path.id": "method.request.path.id",
        },

        requestTemplates: {
          "application/json": JSON.stringify({
            TableName: destinationTable.tableName,
            KeyConditionExpression: "Id = :pk",
            ExpressionAttributeValues: {
              ":pk": { S: "$input.params('id')" },
            },
          }),
        },

        integrationResponses: [
          {
            selectionPattern: "400",
            statusCode: "400",
            responseTemplates: {
              "application/json": JSON.stringify({ error: "Bad input" }),
            },
          },
          {
            statusCode: "200",
            responseTemplates: {
              "application/json": JSON.stringify({
                Id: "$input.path('$.Items[0].Id.S')",
                email: "$input.path('$.Items[0].email.S')",
                message: "$input.path('$.Items[0].message.S')",
                seviceRate: "$input.path('$.Items[0].serviceRate.N')",
              }),
            },
          },
        ],
      },
    });
    resource.addMethod("GET", dynamoQueryIntegration, {
      methodResponses: [{ statusCode: "200" }],
      requestParameters: {
        "method.request.path.id": true,
      },
    });
  }
}
