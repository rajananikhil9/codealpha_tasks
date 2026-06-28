from flask import Blueprint, request, jsonify
from services.validator import validate_record
from services.normalizer import normalize
from services.similarity_checker import calculate_similarity
from dynamodb import table, rejected_table
from datetime import datetime
import traceback

records_bp = Blueprint("records", __name__)

# -----------------------------
# Add Record
# -----------------------------
@records_bp.route("/add", methods=["POST"])
def add_record():

    try:

        data = request.get_json()

        print("Received:", data)

        table.put_item(
            Item={
                "email": data["email"],
                "name": data["name"],
                "phone": data["phone"],
                "status": "Unique",
                "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }
        )

        return jsonify({
            "success": True,
            "message": "Saved Successfully"
        })

    except Exception as e:

        import traceback
        traceback.print_exc()

        return jsonify({
            "success": False,
            "error": str(e)
        }),500

# -----------------------------
# View Unique Records
# -----------------------------
@records_bp.route("/all", methods=["GET"])
def get_all_records():

    response = table.scan()

    return jsonify({
        "success": True,
        "records": response.get("Items", [])
    })


# -----------------------------
# View Rejected Records
# -----------------------------
@records_bp.route("/rejected", methods=["GET"])
def get_rejected_records():

    response = rejected_table.scan()

    return jsonify({
        "success": True,
        "records": response.get("Items", [])
    })


# -----------------------------
# Search Records
# -----------------------------
@records_bp.route("/search", methods=["GET"])
def search_records():

    keyword = request.args.get("keyword", "").lower()

    response = table.scan()

    records = response.get("Items", [])

    filtered = []

    for record in records:

        if (
            keyword in record.get("name", "").lower()
            or keyword in record.get("email", "").lower()
            or keyword in record.get("phone", "")
        ):
            filtered.append(record)

    return jsonify({
        "success": True,
        "records": filtered
    })


# -----------------------------
# Dashboard Statistics
# -----------------------------
@records_bp.route("/stats", methods=["GET"])
def get_stats():

    try:

        unique_response = table.scan()
        rejected_response = rejected_table.scan()

        unique_records = unique_response.get("Items", [])
        rejected_records = rejected_response.get("Items", [])

        return jsonify({
            "total": len(unique_records),
            "unique": len(unique_records),
            "duplicates": len(rejected_records)
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500