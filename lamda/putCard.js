var AWS = require('aws-sdk');
var documentClient = new AWS.DynamoDB.DocumentClient({
    apiVersion: '2012-08-10'
});

const tableName = "Cards";

exports.handler = async event => {
    console.log("Received : " + JSON.stringify(event, null, 2));
    let response = "";
    try{
        const id = event.pathParameters.id;
        const body = JSON.parse(event.body);     
        var params = {
            TableName: tableName,
            Key: { id :  id},
            UpdateExpression: 'set #c = :c, #t = :t',   //#c : category, #t : title
            //ConditionExpression: '#a < :MAX', 여기서 사용안해서 주석
            ExpressionAttributeNames: {'#c' : "category", "#t" : "title"},
            ExpressionAttributeValues: {
              ':c' : body.category,
              ':t' : body.title,
            }
          };
        //결과 받기(id)
        const cards = await documentClient.update(params).promise();

        response = {
            statusCode: 200
        };
    }catch (exception){
        console.error(exception);
        response = {
            statusCode: 500,
            body: JSON.stringify({"Message : ": exception}),
        };
    }
    return response;
};
