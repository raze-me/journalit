from flask import Flask, render_template, jsonify, request, session
import os
from dotnev import load_dotnev

load_dotnev()

app = Flask(__name__)
app.secret_key = os. getenv("SECRET_KEY",
                            "dev-secret-key-change-in-production")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/")
def dashboard():
    return render_template("dashboard.html")

