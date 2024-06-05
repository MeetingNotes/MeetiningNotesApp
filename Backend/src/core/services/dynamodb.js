const AWS = require("aws-sdk");
const dynamoDBClient = new AWS.DynamoDB()

module.exports = {  dynamoDBClient };