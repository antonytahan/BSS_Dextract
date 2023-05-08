def predict(url, model_url):
  import requests
  import PyPDF2
  import pandas as pd
  import numpy as np
  import pickle
  import os
  import sklearn as sk
  import sys
  import pytesseract
  from PIL import Image
  import io
  import pdfplumber
  from wand.exceptions import WandError
  import time
  import re
  import urllib3
  import pdfplumber
  import io
  import re
  import nltk
  nltk.download("popular")
  from nltk.stem.wordnet import WordNetLemmatizer
  from nltk.corpus import stopwords
  from nltk.corpus import words
  from nltk.tokenize import word_tokenize
  from sklearn.preprocessing import LabelEncoder
  from tensorflow.keras.preprocessing.text import Tokenizer
  from tensorflow.keras.preprocessing.sequence import pad_sequences
  from tensorflow.keras.utils import to_categorical

  http = urllib3.PoolManager()
  temp = io.BytesIO()
  temp.write(http.request("GET", url).data)
  full_text = ''

  Lem = WordNetLemmatizer()
  stop_words = stopwords.words("english")
  english_words = set(words.words())
  try:    # to verify is the url has valid pdf file!
      pdf = pdfplumber.open(temp)
      for page in pdf.pages:
        image = page.to_image()
        image = image.original
        page_text = pytesseract.image_to_string(image)
        full_text += page_text
      # Remove mentions, hashtags and urls.
      full_text = re.sub(r"(?:\@|\#|https?\://)\S+", "", full_text)
      # Keep alphabetic sequences only
      full_text = re.sub(r'[^a-zA-Z]', ' ', full_text)

      # tokenize sentence
      token_out = word_tokenize(full_text)
      # Lemmatize words using both settings from nltk as:
      # 'v' works for bombing -> bomb
      # 'n' works for years-> year
      full_text = " ".join([Lem.lemmatize(Lem.lemmatize(w, 'v'), 'n') for w in token_out])

      # Keep only words longer than two characters
      # ignore stopwords and words that are not in the english vocabulary
      token_out = [w for w in token_out if (not w in stop_words) and (w in english_words) \
                  and (len(w) > 2)]
      
      out =  " ".join([w for w in token_out])
      
      # ------------- MODEL -----------
      MAX_NB_WORDS = 5000
      MAX_SEQUENCE_LENGTH = 200
      EMBEDDING_DIM = 100
      loaded_model = pickle.load(open(model_url, 'rb'))
      # make longtext into a pandas dataframe with column text
      longtext = pd.DataFrame({'text': [out]})
      # Convert all non-string values in the 'text' column to strings
      longtext['text'] = longtext['text'].astype(str)
      # Tokenize and pad the text data
      tokenizer = Tokenizer(num_words=MAX_NB_WORDS, filters='!"#$%&()*+,-./:;<=>?@[\]^_`{|}~', lower=True)
      tokenizer.fit_on_texts(longtext['text'].values)
      word_index = tokenizer.word_index
      X = tokenizer.texts_to_sequences(longtext['text'].values)
      X = pad_sequences(X, maxlen=MAX_SEQUENCE_LENGTH)

      # Make predictions
      Y_pred = loaded_model.predict(X)
      Y_pred_classes = np.argmax(Y_pred, axis=1)


      classes = ['Consumer', 'Cybersecurity', 'Data Analytics and Management',
            'Education', 'Enterprise', 'Entertainment', 'Finance and Banking',
            'Health Care', 'Media and Advertising', 'Other', 'Real Estate',
            'Tech']
      industry = classes[Y_pred_classes[0]]
      print(industry) 
      return 'Name Success', industry, out, url
  except Exception as e:
      print('error is', e)
      return 'name fail', 'industry fail', 'long text fail', url