def normalize(data):
    data["name"] = data["name"].strip().lower()
    data["email"] = data["email"].strip().lower()
    data["phone"] = data["phone"].strip()

    return data