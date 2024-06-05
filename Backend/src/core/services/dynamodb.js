const AWS = require("aws-sdk");
const { DynamoDB } = AWS.DynamoDB;

const dynamoDBClient = new DynamoDB();

module.exports = {  dynamoDBClient };