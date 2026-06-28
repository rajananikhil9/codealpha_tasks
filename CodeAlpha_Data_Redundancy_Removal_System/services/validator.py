import re

def validate_record(data):
    if not data.get("name"):
        return False, "Name is required"

    if not data.get("email"):
        return False, "Email is required"

    email_pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'

    if not re.match(email_pattern, data["email"]):
        return False, "Invalid email format"

    if not data.get("phone"):
        return False, "Phone number is required"

    return True, "Valid"