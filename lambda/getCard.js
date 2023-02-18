var AWSXRay = require("aws-xray-sdk");
var AWS = AWSXRay.captureAWS(require('aws-sdk'));

//var AWS = require('aws-sdk');
var documentClient = new AWS.DynamoDB.DocumentClient({
    apiVersion: '2012-08-10'
});

const tableName = "Cards";

exports.handler = async event => {
    var segment = AWSXRay.getSegment();
    var subsegment = segment.addNewSubsegment("Main Logic");
    subsegment.addAnnotation("App", "Kanban Lambda");

    console.log("Received : " + JSON.stringify(event, null, 2));
    let response = "";
    var params 
    try{
        params = {
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
            //body: JSON.stringify({"Message : ": exception}),
            body: JSON.stringify({"Message : ": "서버에러"})
        };
        subsegment.addMetadata("Exception",exception.stack.toString());
        subsegment.addMetadata("Event",event);
        subsegment.addMetadata("Parameter",params);
        subsegment.close(exception);
    }
    subsegment.close();
    return response;
};
