from flask import Flask, render_template, request

import joblib
import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder

app = Flask(__name__)

# Load the saved model
model_filename = "weather_condition_classifier_model.pkl"
loaded_model = joblib.load(model_filename)

# Load the dataset
file_path = "C:/Users/uday8/Documents/SEM_6/GIS/Project/IndianWeatherRepository.csv"
weather_data = pd.read_csv(file_path)

# Create a label encoder and fit it to the 'region' column
label_encoder = LabelEncoder()
label_encoder.fit(weather_data['region'])

# Define weather conditions suitable for outdoor activities
good_weather_conditions = ['Partly cloudy', 'Sunny', 'Clear', 'Partly Cloudy']

def is_good_weather(prediction):
    return prediction in good_weather_conditions

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/index', methods=['GET', 'POST'])
def index():
    prediction_result = None

    if request.method == 'POST':
        user_region = request.form['region']
        user_temperature = float(request.form['temperature'])
        user_humidity = float(request.form['humidity'])

        # Encode the user input for 'region'
        user_region_encoded = label_encoder.transform([user_region])[0]

        # Create a user input array
        user_input = np.array([[user_region_encoded, user_temperature, user_humidity]])

        # Make prediction
        prediction = loaded_model.predict(user_input)[0]

        # Determine if the weather is suitable for outdoor activities
        is_suitable = is_good_weather(prediction)

        # Prepare the result to display on the same page
        prediction_result = {
            'prediction': prediction,
            'is_suitable': is_suitable
        }

    return render_template('index.html', prediction_result=prediction_result)

@app.route('/map')
def map():
    # Add code for the map page as needed
    return render_template('map.html')

if __name__ == '__main__':
    app.run(debug=True)
