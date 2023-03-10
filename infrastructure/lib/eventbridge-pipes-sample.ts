import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { ApiGateway } from "./apigateway";
import { Database } from "./database";
import { EventBus } from "./eventbus";
import { Lambdas } from "./lambdas";
import { Pipe } from "./pipe";

export class EventBridgePipeSample extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const applicationName = "eventbridge-pipes-sample";

    const database = new Database(this, "database", { applicationName });

    const apiGateway = new ApiGateway(this, "apigateway", {
      applicationName,
      destinationTable: database.table,
    });

    const eventBus = new EventBus(this, "eventbus", {
      applicationName,
    });

    const lambdas = new Lambdas(this, "lambdas", {
      applicationName,
      eventBus: eventBus.eventBus,
    });

    const pipe = new Pipe(this, "pipe", {
      applicationName,
      sourceDb: database.table,
      targetEventBus: eventBus.eventBus,
    });
  }
}
