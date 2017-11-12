from flask import Flask, request, send_from_directory
app = Flask(__name__)

@app.route('/')
def index():
    return send_from_directory(directory='static', filename='index.html')

@app.route('/sketch.js')
def serve_sketch():
    return send_from_directory(directory='static', filename='sketch.js')

@app.route('/hs-logo.png')
def serve_logo():
    return send_from_directory(directory='static', filename='hs-logo.png')

@app.route('/style.css')
def serve_css():
    return send_from_directory(directory='static', filename='style.css')