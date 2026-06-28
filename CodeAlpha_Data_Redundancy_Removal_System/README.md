# CodeAlpha Data Redundancy Removal System

## Overview

The **Cloud-Based Data Redundancy Removal System** is a web application developed using **Python Flask** and **AWS DynamoDB**. It helps identify duplicate records and false-positive entries before storing data, ensuring a clean and consistent database.

This project was developed as part of the **CodeAlpha Internship Program**.

---

## Features

* Admin Login Authentication (JWT)
* Add New Records
* Input Validation
* Data Normalization
* Duplicate Email Detection
* False Positive Detection using Similarity Matching
* AWS DynamoDB Integration
* Dashboard Statistics
* View All Records
* Search Records
* View Duplicate & False Positive Records
* Responsive Admin Dashboard

---

## Technology Stack

* **Frontend:** HTML5, CSS3, JavaScript
* **Backend:** Python Flask
* **Database:** AWS DynamoDB
* **Authentication:** Flask-JWT-Extended (JWT)
* **Cloud Platform:** Amazon Web Services (AWS)

---

## Project Structure

```text
CodeAlpha_Data_Redundancy_Removal_System/
│
├── routes/
│   ├── auth.py
│   └── records.py
│
├── services/
│   ├── validator.py
│   ├── normalizer.py
│   └── similarity_checker.py
│
├── static/
│   ├── css/
│   └── js/
│
├── templates/
│   ├── login.html
│   ├── dashboard.html
│   ├── add_record.html
│   ├── records.html
│   └── duplicates.html
│
├── app.py
├── config.py
├── dynamodb.py
├── jwt_auth.py
├── requirements.txt
└── README.md
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/rajananikhil9/codealpha_tasks.git
```

Go to the project folder:

```bash
cd CodeAlpha_Data_Redundancy_Removal_System
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the application:

```bash
python app.py
```

Open your browser:

```
http://127.0.0.1:5000
```

---

## AWS DynamoDB Tables

### DataRecords

Stores all unique records.

Partition Key:

```
email (String)
```

### RejectedRecords

Stores duplicate and false-positive records.

Partition Key:

```
email (String)
```

---

## System Workflow

1. User logs in.
2. User submits a new record.
3. Input is validated.
4. Data is normalized.
5. Duplicate email is checked.
6. Similarity matching detects false positives.
7. Unique records are stored in **DataRecords**.
8. Duplicate and false-positive records are stored in **RejectedRecords**.
9. Dashboard statistics update automatically.

---

## Future Enhancements

* Email Notifications
* PDF Report Generation
* CSV Export
* Advanced Search Filters
* Role-Based Access Control
* Data Analytics Dashboard
* Cloud Deployment (AWS EC2 / Elastic Beanstalk)

---

## Author

**Nikhil Rajana**

GitHub: https://github.com/rajananikhil9

---

## License

This project was developed for educational purposes as part of the **CodeAlpha Internship Program**.
