from flask import Flask, render_template
from flask_jwt_extended import JWTManager
from config import Config
from routes.auth import auth_bp
from routes.records import records_bp

app = Flask(__name__)
app.config.from_object(Config)

jwt = JWTManager(app)

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(records_bp, url_prefix="/api/records")


@app.route("/")
def home():
    return render_template("login.html")


@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")


@app.route("/add-record")
def add_record_page():
    return render_template("add_record.html")


@app.route("/records")
def records_page():
    return render_template("records.html")


@app.route("/duplicates")
def duplicates_page():
    return render_template("duplicates.html")


if __name__ == "__main__":
    app.run(debug=True)