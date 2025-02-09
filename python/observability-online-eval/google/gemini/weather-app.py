import os
import dotenv
from flask import Flask, request
from flask.json import jsonify
from google import genai

dotenv.load_dotenv()

app = Flask(__name__)
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def get_current_weather(location: str) -> str:
    """Get the current whether in a given location.

    Args:
        location: required, The city and state, e.g. San Franciso, CA
        unit: celsius or fahrenheit
    """
    print(f"Called with: {location=}")
    return "23C"


@app.post("/ask")
def ask_weather():
    if request is None or request.json is None:
        return jsonify({"data": "Invalid query"}), 400
    query = request.json["query"]
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=query,
        config={
            "tools": [get_current_weather],
            "system_instruction": "You are a helpful assisatant",
            "temperature": 0.8,
        },
    )
    return jsonify({"data": response.text})


app.run(port=8000)
