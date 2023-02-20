# eventbridge-pipes-ddb-fanout-to-multiple-lambdas-sample

Full code and Github actions workflow for this bog post:

https://medium.com/@zied-ben-tahar/dynamodb-stream-fan-out-to-multiple-lambda-functions-with-eventbridge-pipes-and-eventbus-e0e5c67fd136


This application serves as an example for an EventBridge Pipes use case: Processing DynamoDb stream by multiple lambdas by using fan-out pattern.

In this example the event bridge pipe defines:

1. the dynamodb stream as a source 
2. and the EventBridge EventBus as a target

And finally, the fan out happens by defining an EB Rule that targets the multiple destination lambdas

**Stack**: NodeJs, typescript and CDK  

![image](https://user-images.githubusercontent.com/6813975/220185900-91e49e53-89b9-4c81-b4c2-dbd10dc30489.png)
