# eventbridge-pipes-sample-ddb-to-multiple-lambdas

This application serves as an example for an EventBridge Pipes use case: Processing DynamoDb stream by multiple lambdas using fanout pattern by using event brige pipes.

In this example the event bridge pipe defines:
1 - the dynamodb stream as a source 
2 - and the EventBridge bus as a target
And finally, the fan out is configured by defining an EB Rule that targets the destination lambdas

Stack: NodeJs, typescript and CDK  
