const AWS = require('../aws/aws');

AWS.config.update({
    region: "us-east-2",
    endpoint: "http://dynamodb.us-east-2.amazonaws.com"
});

const db = new AWS.DynamoDB.DocumentClient();

module.exports = db;