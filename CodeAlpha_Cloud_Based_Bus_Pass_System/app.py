from flask import (
    Flask,
    request,
    jsonify,
    render_template,
    redirect,
    session,
    send_file
)

from flask_cors import CORS


import sqlite3



import os
from datetime import datetime

# =====================================================
# APP CONFIG
# =====================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = Flask(
    __name__,
    template_folder=os.path.join(BASE_DIR, "templates"),
    static_folder=os.path.join(BASE_DIR, "static")
)
print("BASE_DIR =", BASE_DIR)
print("Template Folder:", app.template_folder)
print("Static Folder:", app.static_folder)

app.secret_key = "cloud_bus_pass_secret_key"

CORS(app)

DATABASE = "database.db"

# =====================================================
# ROUTE FARES
# =====================================================

ROUTES = {
    "Bhubaneswar-Cuttack": 50,
    "Bhubaneswar-Puri": 60,
    "Puri-Konark": 40
}

# =====================================================
# DATABASE CONNECTION
# =====================================================

def get_db():

    conn = sqlite3.connect(DATABASE)

    conn.row_factory = sqlite3.Row

    return conn


# =====================================================
# DATABASE TABLES
# =====================================================

def init_db():

    conn = get_db()

    cursor = conn.cursor()

    # -----------------------------
    # Admins
    # -----------------------------

    cursor.execute("""

    CREATE TABLE IF NOT EXISTS admins(

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        username TEXT UNIQUE,

        password TEXT

    )

    """)

    # -----------------------------
    # Users
    # -----------------------------

    cursor.execute("""

    CREATE TABLE IF NOT EXISTS users(

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        name TEXT,

        email TEXT,

        mobile TEXT,

        category TEXT

    )

    """)

    # -----------------------------
    # Routes
    # -----------------------------

    cursor.execute("""

    CREATE TABLE IF NOT EXISTS routes(

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        route_name TEXT,

        source TEXT,

        destination TEXT,

        distance INTEGER,

        daily_fare INTEGER,

        weekly_fare INTEGER,

        monthly_fare INTEGER

    )

    """)

    
    # -----------------------------
    # Inquiries
    # -----------------------------

    cursor.execute("""

    CREATE TABLE IF NOT EXISTS inquiries(

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        name TEXT,

        email TEXT,

        message TEXT,

        created_at TEXT

    )

    """)

    # -----------------------------
    # Settings
    # -----------------------------

    cursor.execute("""

    CREATE TABLE IF NOT EXISTS settings(

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        site_name TEXT,

        phone TEXT,

        email TEXT,

        address TEXT,

        banner TEXT,

        footer TEXT

    )

    """)

    conn.commit()

    conn.close()


# =====================================================
# CREATE DEFAULT ADMIN
# =====================================================

def create_default_admin():

    conn = get_db()

    cursor = conn.cursor()

    cursor.execute("""

    INSERT OR IGNORE INTO admins(
        username,
        password
    )

    VALUES(
        'admin',
        'admin123'
    )

    """)

    conn.commit()

    conn.close()


# =====================================================
# APP STARTUP
# =====================================================

init_db()

create_default_admin()


# =====================================================
# HOME
# =====================================================

@app.route("/")
def home():
    return render_template("index.html")

# =====================================================
# ADMIN LOGIN
# =====================================================

@app.route("/admin/login", methods=["POST"])
def admin_login():

    data = request.json

    username = data.get("username")

    password = data.get("password")

    conn = get_db()

    cursor = conn.cursor()

    cursor.execute("""

        SELECT *

        FROM admins

        WHERE username=?

        AND password=?

    """, (

        username,

        password

    ))

    admin = cursor.fetchone()

    conn.close()

    if admin:

        session["admin"] = username

        return jsonify({

            "success": True

        })

    return jsonify({

        "success": False

    })


# =====================================================
# LOGOUT
# =====================================================

@app.route("/logout")
def logout():

    session.clear()

    return redirect("/")


# =====================================================
# LOGIN CHECK
# =====================================================

def admin_required():

    return "admin" in session


# =====================================================
# DASHBOARD API (DynamoDB)
# =====================================================

@app.route("/api/dashboard")
def dashboard_api():

    import requests

    # Get all passes from Lambda
    response = requests.get(
        "https://ekuzo8kbn5.execute-api.ap-south-1.amazonaws.com/passes"
    )

    passes = response.json()

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM users")
    total_users = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM routes")
    total_routes = cursor.fetchone()[0]

    conn.close()

    total_passes = len(passes)

    revenue = sum(int(p.get("price", 0)) for p in passes)

    active = sum(
        1 for p in passes
        if p.get("status") == "Active"
    )

    pending = sum(
        1 for p in passes
        if p.get("status") == "Pending"
    )

    rejected = sum(
        1 for p in passes
        if p.get("status") == "Rejected"
    )

    expired = sum(
        1 for p in passes
        if p.get("status") == "Expired"
    )

    recent_passes = []

    for p in passes[-5:]:

        recent_passes.append({

            "pass_id": p.get("pass_id"),

            "name": p.get("name"),

            "pass_type": p.get("serviceType"),

            "date": p.get("created_at"),

            "status": p.get("status")

        })

    return jsonify({

        "revenue": revenue,

        "users": total_users,

        "routes": total_routes,

        "passes": total_passes,

        "active": active,

        "expired": expired,

        "pending": pending,

        "rejected": rejected,

        "recent_passes": recent_passes,

        "chart_labels": [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun"
        ],

        "chart_values": [
            1200,
            1800,
            2400,
            3100,
            4200,
            revenue
        ]

    })
@app.route("/api/reports")
def reports_api():

    import requests

    response = requests.get(
        "https://ekuzo8kbn5.execute-api.ap-south-1.amazonaws.com/passes"
    )

    passes = response.json()

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM routes")
    total_routes = cursor.fetchone()[0]

    conn.close()

    revenue = sum(int(p.get("price", 0)) for p in passes)

    active = sum(
        1 for p in passes
        if p.get("status") == "Active"
    )

    return jsonify({

        "revenue": revenue,

        "total_passes": len(passes),

        "active_passes": active,

        "routes": total_routes,

        "months": [
            "Jan","Feb","Mar","Apr","May","Jun"
        ],

        "monthly_revenue": [
            1200,
            1800,
            2500,
            3200,
            4100,
            revenue
        ],

        "route_names":[
            "City Center",
            "University",
            "Student",
            "Tech Park"
        ],

        "route_counts":[
            30,
            22,
            15,
            10
        ]

    })
# =====================================================
# USERS APIs
# =====================================================

@app.route("/api/users")
def get_users():

    conn = get_db()

    users = conn.execute(
        "SELECT * FROM users"
    ).fetchall()

    conn.close()

    return jsonify([

        dict(user)

        for user in users

    ])


@app.route(
    "/api/users/<int:user_id>",
    methods=["DELETE"]
)
def delete_user(user_id):

    conn = get_db()

    conn.execute(

        "DELETE FROM users WHERE id=?",

        (user_id,)

    )

    conn.commit()

    conn.close()

    return jsonify({

        "success": True

    })


# =====================================================
# ROUTES APIs
# =====================================================

@app.route("/api/routes")
def get_routes():

    conn = sqlite3.connect("database.db")
    conn.row_factory = sqlite3.Row

    routes = conn.execute("""
        SELECT *
        FROM routes
    """).fetchall()

    conn.close()

    return jsonify([
        dict(route)
        for route in routes
    ])


@app.route("/api/routes", methods=["POST"])
def add_route():

    data = request.get_json()

    conn = sqlite3.connect("database.db")

    conn.execute("""
        INSERT INTO routes
        (
            route_name,
            source,
            destination,
            distance,
            daily_fare,
            weekly_fare,
            monthly_fare
        )
        VALUES (?,?,?,?,?,?,?)
    """,
    (
        data["route_name"],
        data["source"],
        data["destination"],
        data["distance"],
        data["daily_fare"],
        data["weekly_fare"],
        data["monthly_fare"]
    ))

    conn.commit()
    conn.close()

    return jsonify({"success": True})



@app.route(
    "/api/routes/<int:route_id>",
    methods=["DELETE"]
)
def delete_route(route_id):

    conn = get_db()

    conn.execute(

        "DELETE FROM routes WHERE id=?",

        (route_id,)

    )

    conn.commit()

    conn.close()

    return jsonify({

        "success": True

    })
    


# =====================================================
# CONTACT API
# =====================================================

@app.route(
    "/api/contact",
    methods=["POST"]
)
def save_contact():

    data = request.json

    conn = get_db()

    conn.execute("""

        INSERT INTO inquiries(

            name,
            email,
            message,
            created_at

        )

        VALUES(
            ?,?,?,?
        )

    """, (

        data["name"],
        data["email"],
        data["message"],
        datetime.now().strftime(
            "%Y-%m-%d %H:%M:%S"
        )

    ))

    conn.commit()

    conn.close()

    return jsonify({

        "success": True

    })


# =====================================================
# INQUIRIES APIs
# =====================================================

@app.route("/api/inquiries")
def get_inquiries():

    conn = get_db()

    rows = conn.execute("""

        SELECT *

        FROM inquiries

        ORDER BY id DESC

    """).fetchall()

    conn.close()

    return jsonify([

        dict(row)

        for row in rows

    ])


@app.route(
    "/api/inquiries/<int:inquiry_id>",
    methods=["DELETE"]
)
def delete_inquiry(inquiry_id):

    conn = get_db()

    conn.execute(

        "DELETE FROM inquiries WHERE id=?",

        (inquiry_id,)

    )

    conn.commit()

    conn.close()

    return jsonify({

        "success": True

    })


# =====================================================
# SETTINGS APIs
# =====================================================

@app.route(
    "/api/settings",
    methods=["GET"]
)
def get_settings():

    conn = get_db()

    row = conn.execute("""

        SELECT *

        FROM settings

        LIMIT 1

    """).fetchone()

    conn.close()

    if row:
        return jsonify(dict(row))

    return jsonify({})


@app.route(
    "/api/settings",
    methods=["POST"]
)
def save_settings():

    data = request.json

    conn = get_db()

    conn.execute(
        "DELETE FROM settings"
    )

    conn.execute("""

        INSERT INTO settings(

            site_name,
            phone,
            email,
            address,
            banner,
            footer

        )

        VALUES(
            ?,?,?,?,?,?
        )

    """, (

        data["site_name"],
        data["phone"],
        data["email"],
        data["address"],
        data["banner"],
        data["footer"]

    ))

    conn.commit()

    conn.close()

    return jsonify({

        "success": True

    })


# =====================================================
# PAGE ROUTES
# =====================================================

@app.route("/apply")
def apply_page():
    return render_template("apply.html")


@app.route("/track")
def track_page():
    return render_template("track.html")


@app.route("/verify")
def verify_page():
    return render_template("verify.html")


@app.route("/contact")
def contact_page():
    return render_template("contact.html")


@app.route("/login")
def login_page():
    return render_template("login.html")


@app.route("/admin/dashboard")
def dashboard_page():

    if not admin_required():
        return redirect("/login")

    return render_template(
        "dashboard.html"
    )


@app.route("/admin/routes")
def routes_page():

    if not admin_required():
        return redirect("/login")

    return render_template(
        "routes.html"
    )


@app.route("/admin/passes")
def passes_page():

    if not admin_required():
        return redirect("/login")

    return render_template(
        "passes.html"
    )


@app.route("/admin/users")
def users_page():

    if not admin_required():
        return redirect("/login")

    return render_template(
        "users.html"
    )


@app.route("/admin/inquiries")
def inquiries_page():

    if not admin_required():
        return redirect("/login")

    return render_template(
        "inquiries.html"
    )


@app.route("/admin/reports")
def reports_page():

    if not admin_required():
        return redirect("/login")

    return render_template(
        "reports.html"
    )


@app.route("/admin/settings")
def settings_page():

    if not admin_required():
        return redirect("/login")

    return render_template(
        "settings.html"
    )


# =====================================================
# RUN APP
# =====================================================

if __name__ == "__main__":

    app.run(
        debug=True,
        host="0.0.0.0",
        port=5000
    )
    
