var AWS = require('aws-sdk');
//https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/index.html
//https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html
//https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html
//https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#scan-property
var documentClient = new AWS.DynamoDB.DocumentClient({
    apiVersion: '2012-08-10'
});

const tableName = "Cards";

exports.handler = async event => {
    console.log("Received : " + JSON.stringify(event, null, 2));
    let response = "";
    try{
        var params = {
            TableName : tableName            
        };        
        const cards = await documentClient.scan(params).promise();

        // TODO implement
        response = {
            //꼭! 읽어보기 https://docs.aws.amazon.com/ko_kr/apigateway/latest/developerguide/how-to-cors.html
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify(cards),
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
