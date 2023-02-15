# eventbridge-pipes-sample-ddb-fanout-to-multiple-lambdas

This application serves as an example for an EventBridge Pipes use case: Processing DynamoDb stream by multiple lambdas by using fanout pattern.

In this example the event bridge pipe defines:
1 - the dynamodb stream as a source 
2 - and the EventBridge bus as a target

And finally, the fan out happens by defining an EB Rule that targets the multiple destination lambdas

**Stack**: NodeJs, typescript and CDK  

![image](https://user-images.githubusercontent.com/6813975/219195584-627d0174-954d-4a2f-8d19-f307f10d24d2.png)
