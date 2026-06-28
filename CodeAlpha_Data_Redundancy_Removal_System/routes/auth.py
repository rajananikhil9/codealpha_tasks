from flask import Blueprint, request, jsonify
from jwt_auth import authenticate

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    username = data.get("username")
    password = data.get("password")

    token = authenticate(username, password)

    if token:
        return jsonify({
            "success": True,
            "token": token
        })

    return jsonify({
        "success": False,
        "message": "Invalid username or password"
    }), 401