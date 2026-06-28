from dynamodb import table

def check_duplicate(email):
    response = table.get_item(
        Key={
            "email": email
        }
    )

    return "Item" in response