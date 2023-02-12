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
       
        await documentClient.update(params).promise();

        response = {
            //꼭! 읽어보기 https://docs.aws.amazon.com/ko_kr/apigateway/latest/developerguide/how-to-cors.html
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
        };
    }catch (exception){
        console.error(exception);
        response = {
            //꼭! 읽어보기 https://docs.aws.amazon.com/ko_kr/apigateway/latest/developerguide/how-to-cors.html
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({"Message : ": exception}),
        };
    }
    return response;
};
