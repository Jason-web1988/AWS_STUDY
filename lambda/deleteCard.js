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
        var params = {
            TableName : tableName,
            Key: {
              "id": id
            }
          };
      
        await documentClient.delete(params).promise();

        response = {
            //꼭! 읽어보기 https://docs.aws.amazon.com/ko_kr/apigateway/latest/developerguide/how-to-cors.html
            statusCode: 204,
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
