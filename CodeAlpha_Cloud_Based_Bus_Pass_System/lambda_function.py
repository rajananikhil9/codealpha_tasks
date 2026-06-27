import json
import uuid
import boto3
import urllib.parse
from decimal import Decimal

# ==========================
# DynamoDB
# ==========================

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("BusPasses")

routes_table = dynamodb.Table("Routes")

# ==========================
# Decimal Converter
# ==========================

def decimal_default(obj):
    if isinstance(obj, Decimal):
        return int(obj)
    raise TypeError

# ==========================
# Lambda Handler
# ==========================

def lambda_handler(event, context):

    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELETE"
    }

    print("EVENT:", json.dumps(event))

    method = (
        event.get("requestContext", {})
        .get("http", {})
        .get("method")
    )

    if not method:
        method = event.get("httpMethod", "")

    raw_path = (
        event.get("rawPath")
        or event.get("requestContext", {})
        .get("http", {})
        .get("path", "")
    )

    print("METHOD =", method)
    print("RAW PATH =", raw_path)

    # ==========================
    # CORS
    # ==========================

    if method == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": headers,
            "body": ""
        }

    try:

        # ==================================
        # GET /track/{id}
        # ==================================

        if method == "GET" and "/track/" in raw_path:

            pass_id = raw_path.split("/")[-1]

            response = table.get_item(
                Key={
                    "pass_id": pass_id
                }
            )

            item = response.get("Item")

            if not item:
                return {
                    "statusCode": 404,
                    "headers": headers,
                    "body": json.dumps({
                        "message": "Pass not found"
                    })
                }

            return {
                "statusCode": 200,
                "headers": headers,
                "body": json.dumps(
                    item,
                    default=decimal_default
                )
            }

        # ==================================
        # GET /passes
        # ==================================

        if method == "GET" and raw_path == "/passes":

            response = table.scan()

            return {
                "statusCode": 200,
                "headers": headers,
                "body": json.dumps(
                    response.get("Items", []),
                    default=decimal_default
                )
            }

        # ==================================
        # GET /routes
        # ==================================

        if method == "GET" and raw_path == "/routes":

            response = routes_table.scan()

            routes = response.get("Items", [])

            return {
                "statusCode": 200,
                "headers": headers,
                "body": json.dumps(
                    routes,
                    default=decimal_default
                )
            }
            
            # ==================================
        # POST /routes
        # ==================================
            
            
        if method == "POST" and raw_path == "/routes":

            body = json.loads(event.get("body", "{}"))

            item = {
                "route_id": str(uuid.uuid4())[:8],
                "route_name": body["route_name"],
                "source": body["source"],
                "destination": body["destination"],
                "distance": body["distance"],
                "daily_fare": body["daily_fare"],
                "weekly_fare": body["weekly_fare"],
                "monthly_fare": body["monthly_fare"]
            }

            routes_table.put_item(Item=item)

            return {
                "statusCode": 200,
                "headers": headers,
                "body": json.dumps(item)
            }

        # ==================================
        # POST /create-pass
        # ==================================

        if method == "POST" and raw_path == "/create-pass":
            body = json.loads(
                event.get("body", "{}")
            )

            pass_id = str(uuid.uuid4())[:8]

            name = body.get("name")
            email = body.get("email")
            mobile = body.get("mobile")
            route = body.get("route")

            validity = body.get(
                "validity",
                "Monthly"
            )

            service_type = body.get(
                "serviceType",
                "Ordinary"
            )

            price = int(
                body.get("price", 0)
            )

            qr_data = json.dumps({
                "pass_id": pass_id,
                "name": name,
                "route": route,
                "price": price,
                "status": "Pending"
            })

            qr_url = (
                "https://api.qrserver.com/v1/create-qr-code/"
                "?size=200x200&data="
                + urllib.parse.quote(qr_data)
            )

            item = {
                "pass_id": pass_id,
                "name": name,
                "email": email,
                "mobile": mobile,
                "route": route,
                "validity": validity,
                "serviceType": service_type,
                "price": price,
                "status": "Pending",
                "created_at": str(uuid.uuid4()),
                "qr_url": qr_url
            }

            table.put_item(
                Item=item
            )

            return {
                "statusCode": 200,
                "headers": headers,
                "body": json.dumps(
                    item,
                    default=decimal_default
                )
            }

        # ==================================
        # PUT /approve/{id}
        # ==================================

        if method == "PUT" and "/approve/" in raw_path:

            pass_id = raw_path.split("/")[-1]

            table.update_item(
                Key={
                    "pass_id": pass_id
                },
                UpdateExpression="SET #s = :s",
                ExpressionAttributeNames={
                    "#s": "status"
                },
                ExpressionAttributeValues={
                    ":s": "Active"
                }
            )

            return {
                "statusCode": 200,
                "headers": headers,
                "body": json.dumps({
                    "message": "Pass Approved"
                })
            }

        # ==================================
        # PUT /reject/{id}
        # ==================================

        if method == "PUT" and "/reject/" in raw_path:

            pass_id = raw_path.split("/")[-1]

            table.update_item(
                Key={
                    "pass_id": pass_id
                },
                UpdateExpression="SET #s = :s",
                ExpressionAttributeNames={
                    "#s": "status"
                },
                ExpressionAttributeValues={
                    ":s": "Rejected"
                }
            )

            return {
                "statusCode": 200,
                "headers": headers,
                "body": json.dumps({
                    "message": "Pass Rejected"
                })
            }
            
            
            # ==================================
# DELETE /routes/{id}
# ==================================

        if method == "DELETE" and "/routes/" in raw_path:

            route_id = raw_path.split("/")[-1]

            routes_table.delete_item(
                Key={
                    "route_id": route_id
                }
            )

        return {
            "statusCode": 200,
            "headers": headers,
            "body": json.dumps({
                "message": "Route Deleted Successfully"
             })
        }
            
                    # ==================================
        # DEFAULT RESPONSE
        # ==================================

        return {
            "statusCode": 200,
            "headers": headers,
            "body": json.dumps({
                "message": "Bus Pass API Running"
            })
        }

    except Exception as e:

        print("ERROR:", str(e))

        return {
            "statusCode": 500,
            "headers": headers,
            "body": json.dumps({
                "error": str(e)
            })
        }