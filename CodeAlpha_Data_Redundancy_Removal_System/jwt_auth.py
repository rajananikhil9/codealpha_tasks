from flask_jwt_extended import create_access_token
from datetime import timedelta

# Change these credentials if needed
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "admin123"

def authenticate(username, password):
    if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
        token = create_access_token(
            identity=username,
            expires_delta=timedelta(hours=2)
        )
        return token
    return None