import boto3

# Connect to local DynamoDB server and this is to run once to create a table with id as key to access data

dynamodb = boto3.resource(
    'dynamodb',
    endpoint_url="http://localhost:8000",
    region_name='us-west-2',
    aws_access_key_id='fakeMyKeyId',
    aws_secret_access_key='fakeSecretAccessKey'
)

# Creating the table
table = dynamodb.create_table(
    TableName='UserProfile',
    KeySchema=[
        {
            'AttributeName': 'id',
            'KeyType': 'HASH'  
        }
    ],
    AttributeDefinitions=[
        {
            'AttributeName': 'id',
            'AttributeType': 'S'
        }
    ],
    ProvisionedThroughput={
        'ReadCapacityUnits': 5,
        'WriteCapacityUnits': 5
    }
)

print("Table status:", table.table_status)
