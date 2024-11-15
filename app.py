from flask import Flask, request, jsonify
from flask_cors import CORS
import boto3
from datetime import datetime
import uuid

app = Flask(__name__)
CORS(app)

# Set up DynamoDB connection to local instance
dynamodb = boto3.resource(
    'dynamodb',
    endpoint_url="http://localhost:8000",  # Local DynamoDB endpoint connects to port 8000 make sure to active it before running front and back
    region_name='us-west-2',               # Region can be any value for local DynamoDB 
    aws_access_key_id='fakeMyKeyId',       # Fake key for local DynamoDB it can be anything
    aws_secret_access_key='fakeSecretAccessKey'
)
table = dynamodb.Table('UserProfile')




@app.route('/api/user/<string:user_id>', methods=['GET'])
def get_user(user_id):
    try:
        # Get user data by primary key (id)
        response = table.get_item(Key={'id': user_id})
        if 'Item' in response:
            return jsonify(response['Item']), 200
        else:
            return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/users', methods=['GET'])
def get_all_users():
    try:
        # Scan all users
        response = table.scan()
        items = response.get('Items', [])
        return jsonify(items), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/upload', methods=['POST'])
def upload_data():
    try:
        # Retrieve form data
        data = request.form
        profile_pic = request.files['profilePic']
        certificate_image = request.files['certificateImage']

        # Generate unique IDs for the files and store them
        profile_pic_id = str(uuid.uuid4())
        certificate_image_id = str(uuid.uuid4())

        # Store form data in DynamoDB
        item = {
            'id': str(uuid.uuid4()),
            'firstName': data['firstName'],
            'middleName': data.get('middleName', ''),
            'lastName': data['lastName'],
            'phoneNumber': data['phoneNumber'],
            'state': data['state'],
            'gender': data['gender'],
            'age': int(data['age']),
            'dob': data['dob'],
            'email': data['email'],
            'domain': data['domain'],
            'profilePicId': profile_pic_id,
            'certificateImageId': certificate_image_id,
            'timestamp': str(datetime.now())
        }
        table.put_item(Item=item)

        return jsonify({"message": "Data submitted successfully!"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
