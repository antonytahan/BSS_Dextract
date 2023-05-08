from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import credentials, firestore, initialize_app
import os
import pyrebase
import time
import math
import random
# get the predict function from predict.py
from predict import predict

# logging.basicConfig(level=logging.DEBUG)
api = Flask(__name__)


# TODO: Must be saved in a private file
config  = {
  'apiKey': "AIzaSyDChohbk4h-sw7hWmGbb6_AfPiSUHzEIi4",
  'authDomain': "dextract-1d40c.firebaseapp.com",
  'projectId': "dextract-1d40c",
  'storageBucket': "dextract-1d40c.appspot.com",
  'messagingSenderId': "821622992810",
  'appId': "1:821622992810:web:e5d064b985e43f9d5585d3",
  'measurementId': "G-6M1T6CKJVV",
    'databaseURL': ""
}

# read firebase service key from dextract_service_key.json which is one level above the current directory
cred = credentials.Certificate(os.path.join(os.path.dirname(__file__), '..', 'new_service_key.json'))
# cred = credentials.Certificate('/dextract_service_key.json')
firebase_admin.initialize_app(cred)
db = firestore.client()
pitchdecks = db.collection('pitchdecks')
users = db.collection('users')

def getRandomNumber():
     return math.floor(random.uniform(0, 1) * 900000) + 100000


firebase = pyrebase.initialize_app(config)
storage = firebase.storage()

@api.route('/api/profile')
def my_profile():
    response_body = {
        "name": "Antony",
        "about" :"Hello, I'm Antony!"
    }

    return response_body


@api.route('/api/decks', methods=['GET', 'POST'])
def get_pitchdecks():
    print('in /api/decks')
    try:
        # Check if ID was passed to URL query
        args = request.args
        id = args.get("param1")
        if id:
            data = users.document(id).get()
            # data contains an array of ids. for each id, get the data from the pitchdecks collection
            # todo
            pitchdeck_ids = data.to_dict()['id']
            print(pitchdeck_ids)
            pitch_data = []
            for id in pitchdeck_ids:
                pitchdeck = pitchdecks.document(id).get().to_dict()
                print('pitchdeck data for id', id, "is", pitchdeck)
                pitch_data.append(pitchdeck)
            return jsonify(pitch_data), 200
    except Exception as e:
        return f"An Error Occured: {e}"


@api.route('/api/upload-pdf', methods=['POST'])
def upload_pdf():
    """
        upload-pdf: hits firebase storage API and appends to user_id/ the pdf file and returns the pdf url generated
    """
    try:
        now = str(int(time.time()))
        userId = request.form.get('userId', False)
        file = request.files.get('fileData', False)
        print('fileObject', file)
        # Storage code
        path_on_cloud = userId + "/" + now + ".pdf"
        pdfurl = storage.child(path_on_cloud).put(file)
        pdf_url=storage.child(path_on_cloud).get_url(pdfurl['downloadTokens'])
        
        return jsonify({"success": True, "file_url": pdf_url}), 200

    except Exception as e:
        print("Error: ", e)
        return f"An error occurred: {e}"
    
@api.route('/api/process-pdf', methods=['PUT'])
def process_pdf(): 
    """
        process-pdf: POST API that access firebase storage pdf and does some processing
    """
    try: 
        pdf_url = request.json['filePath']
        id = request.json['userId']
        # Read PDF here
        # Calls helper method store: which will update the firebase DB with pitchdeck ID
        pitchdeck_id = str(getRandomNumber())
        # name, industry, LongText, url = predict(pdf_url, "finalized_model.sav")
        
        name, industry, LongText, url = "name", "industry test", "LongText test", pdf_url
        users.document(id).set({'id':[pitchdeck_id]})
        # submit the output to firebase
        pitchdecks.document(pitchdeck_id).set({
            'name': name,
            'industry': industry,
            'LongText': LongText,
            'url': url
            })

        print("File processed and db updated!")
        return jsonify({"success": True}), 200
    
    except Exception as e:
        print("Error", e)
        return f"An error occurred: {e}"