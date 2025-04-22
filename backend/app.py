from flask import Flask, jsonify, request
import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv
import os
import logging
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database connection
def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host="localhost",           
            user="root",                 
            password="161005",    
            database="grade_predictor" 
        )
        return connection
    except Error as e:
        logger.error(f"Error connecting to MySQL: {e}")
        return None
    
# Simple login route
@app.route('/login', methods=['POST'])
def login():
    email = request.json.get('email')
    password = request.json.get('password')
    role = request.json.get('role')

    # Check if credentials are valid
    connection = get_db_connection()
    if connection is None:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        cursor = connection.cursor(dictionary=True)
        
        if role == 'student':
            cursor.execute("SELECT * FROM StudentUsers WHERE email = %s", (email,))
        elif role == 'instructor':
            cursor.execute("SELECT * FROM InstructorUsers WHERE email = %s", (email,))
        else:
            return jsonify({"error": "Invalid role"}), 400
        
        user = cursor.fetchone()
        cursor.close()

        if user and user['password_hash'] == password:
            # Redirect to the appropriate dashboard based on role
            if role == 'student':
                user_info = {
                    "name": user["user_id"],
                    "roll_number": user.get("RollNumber"),  # Only if student
                    "email": user["email"]
                }
                return jsonify({
                    "message": "Login successful",
                    "role": role,
                    "user": user_info,
                    "redirect_url": "/dashboard"
                })
            elif role == 'instructor':
                return jsonify({"message": "Login successful", "redirect_url": "/instructorcourse"})
        else:
            return jsonify({"error": "Invalid credentials"}), 401
    except Exception as e:
        print("Login error:", e)
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()

# Get student's enrolled courses
@app.route("/students/<roll_number>/courses", methods=["GET"])
def get_student_courses(roll_number):
    connection = get_db_connection()
    if connection is None:
        return jsonify({"error": "Database connection failed"}), 500
    try:
        cursor = connection.cursor(dictionary=True)
        
        # Get courses enrolled by the student
        cursor.execute("""
        SELECT c.CourseCode, c.Name AS CourseName, i.Name AS InstructorName
        FROM Enrolls e
        JOIN Courses c ON e.CourseCode = c.CourseCode
        JOIN Instructors i ON c.ProfessorID = i.InstructorID
        WHERE e.RollNumber = %s
        """, (roll_number,))
        courses = cursor.fetchall()

        # Get upcoming deadlines per course
        cursor.execute("""
        SELECT gc.CourseCode, gc.ComponentName, gc.EndDate
        FROM GradedComponents gc
        JOIN Enrolls e ON gc.CourseCode = e.CourseCode
        WHERE e.RollNumber = %s AND gc.EndDate > CURDATE()
        ORDER BY gc.EndDate
        """, (roll_number,))
        deadlines = cursor.fetchall()

        # Group deadlines by course
        deadline_map = {}
        for d in deadlines:
            deadline_map.setdefault(d["CourseCode"], []).append({
                "ComponentName": d["ComponentName"],
                "EndDate": d["EndDate"]
            })

        # Final data format
        enriched_courses = []
        for course in courses:
            course_code = course["CourseCode"]
            enriched_courses.append({
                "CourseCode": course_code,
                "CourseName": course["CourseName"],
                "InstructorName": course["InstructorName"],
                "Deadlines": deadline_map.get(course_code, [])
            })

        cursor.close()
        connection.close()
        return jsonify(enriched_courses)

    except Error as e:
        logger.error(f"Error fetching student courses: {e}")
        cursor.close()
        connection.close()
        return jsonify({"error": str(e)}), 500

# Get courses taught by an instructor
@app.route("/instructors/<instructor_id>/courses", methods=["GET"])
def get_instructor_courses(instructor_id):
    connection = get_db_connection()
    if connection is None:
        return jsonify({"error": "Database connection failed"}), 500
    try:
        cursor = connection.cursor(dictionary=True)
        query = """
        SELECT c.CourseCode, c.Name
        FROM Teaches t
        JOIN Courses c ON t.CourseCode = c.CourseCode
        WHERE t.InstructorID = %s
        """
        cursor.execute(query, (instructor_id,))
        courses = cursor.fetchall()
        cursor.close()
        connection.close()
        return jsonify(courses)
    except Error as e:
        logger.error(f"Error fetching instructor courses: {e}")
        cursor.close()
        connection.close()
        return jsonify({"error": str(e)}), 500

# Retrieve students with their instructors
@app.route("/students/instructors", methods=["GET"])
def get_students_with_instructors():
    connection = get_db_connection()
    if connection is None:
        return jsonify({"error": "Database connection failed"}), 500
    try:
        cursor = connection.cursor(dictionary=True)
        query = """
        SELECT s.RollNumber, s.Name AS StudentName, c.Name AS CourseName, i.Name AS InstructorName
        FROM Students s
        JOIN Enrolls e ON s.RollNumber = e.RollNumber
        JOIN Courses c ON e.CourseCode = c.CourseCode
        JOIN Instructors i ON c.ProfessorID = i.InstructorID
        """
        cursor.execute(query)
        students_instructors = cursor.fetchall()
        cursor.close()
        connection.close()
        return jsonify(students_instructors)
    except Error as e:
        logger.error(f"Error fetching students with instructors: {e}")
        cursor.close()
        connection.close()
        return jsonify({"error": str(e)}), 500

# Get top 3 students with the highest CGPA
@app.route("/students/top-cgpa", methods=["GET"])
def get_top_students():
    connection = get_db_connection()
    if connection is None:
        return jsonify({"error": "Database connection failed"}), 500
    try:
        cursor = connection.cursor(dictionary=True)
        query = """
        SELECT RollNumber, Name, CurrentCGPA
        FROM Students
        ORDER BY CurrentCGPA DESC
        LIMIT 3
        """
        cursor.execute(query)
        top_students = cursor.fetchall()
        cursor.close()
        connection.close()
        return jsonify(top_students)
    except Error as e:
        logger.error(f"Error fetching top students: {e}")
        cursor.close()
        connection.close()
        return jsonify({"error": str(e)}), 500

# Get students who scored below 40% in any component
@app.route("/courses/low-scorers", methods=["GET"])
def get_courses_with_low_scores():
    connection = get_db_connection()
    if connection is None:
        return jsonify({"error": "Database connection failed"}), 500
    try:
        cursor = connection.cursor(dictionary=True)
        query = """
        SELECT DISTINCT c.CourseCode, c.Name
        FROM Courses c
        JOIN GradedComponents gc ON c.CourseCode = gc.CourseCode
        JOIN StudentComponentScores scs ON gc.ComponentID = scs.ComponentID
        WHERE scs.Score < 40
        """
        cursor.execute(query)
        courses_with_low_scores = cursor.fetchall()
        cursor.close()
        connection.close()
        return jsonify(courses_with_low_scores)
    except Error as e:
        logger.error(f"Error fetching courses with low scorers: {e}")
        cursor.close()
        connection.close()
        return jsonify({"error": str(e)}), 500

# Get required marks to achieve target grade
@app.route("/students/<roll_number>/target-grade", methods=["GET"])
def get_required_marks_for_grade(roll_number):
    target = float(request.args.get('target', 0))  # Target grade
    connection = get_db_connection()
    if connection is None:
        return jsonify({"error": "Database connection failed"}), 500
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.callproc('get_required_marks_for_grade', (roll_number, target))  # Assuming the stored procedure is available
        cursor.execute("SELECT * FROM RequiredMarksResult")  # Assuming result is saved in a temporary table
        result = cursor.fetchall()
        cursor.close()
        connection.close()
        return jsonify(result)
    except Error as e:
        logger.error(f"Error predicting required marks: {e}")
        cursor.close()
        connection.close()
        return jsonify({"error": str(e)}), 500

# Fetch course details with instructor name
@app.route("/courses/details", methods=["GET"])
def get_courses_with_instructors():
    connection = get_db_connection()
    if connection is None:
        return jsonify({"error": "Database connection failed"}), 500
    try:
        cursor = connection.cursor(dictionary=True)
        query = """
        SELECT c.CourseCode, c.Name AS CourseName, i.Name AS InstructorName
        FROM Courses c
        JOIN Instructors i ON c.ProfessorID = i.InstructorID
        """
        cursor.execute(query)
        course_details = cursor.fetchall()
        cursor.close()
        connection.close()
        return jsonify(course_details)
    except Error as e:
        logger.error(f"Error fetching course details: {e}")
        cursor.close()
        connection.close()
        return jsonify({"error": str(e)}), 500

# Retrieve TA assignments for a specific course
@app.route("/courses/<course_code>/tas", methods=["GET"])
def get_ta_assignments(course_code):
    connection = get_db_connection()
    if connection is None:
        return jsonify({"error": "Database connection failed"}), 500
    try:
        cursor = connection.cursor(dictionary=True)
        query = """
        SELECT t.RollNumber, s.Name AS TA_Name, c.CourseCode, c.Name AS CourseName
        FROM Is_TA_Of t
        JOIN Students s ON t.RollNumber = s.RollNumber
        JOIN Courses c ON t.CourseCode = c.CourseCode
        WHERE c.CourseCode = %s
        """
        cursor.execute(query, (course_code,))
        ta_assignments = cursor.fetchall()
        cursor.close()
        connection.close()
        return jsonify(ta_assignments)
    except Error as e:
        logger.error(f"Error fetching TA assignments: {e}")
        cursor.close()
        connection.close()
        return jsonify({"error": str(e)}), 500

# Get aggregate: average grade per course
@app.route("/courses/average-grade", methods=["GET"])
def get_average_grade_per_course():
    connection = get_db_connection()
    if connection is None:
        return jsonify({"error": "Database connection failed"}), 500
    try:
        cursor = connection.cursor(dictionary=True)
        query = """
        SELECT CourseCode, AVG(Grade) AS AverageGrade
        FROM Assigns_Grades
        GROUP BY CourseCode
        """
        cursor.execute(query)
        average_grades = cursor.fetchall()
        cursor.close()
        connection.close()
        return jsonify(average_grades)
    except Error as e:
        logger.error(f"Error fetching average grade per course: {e}")
        cursor.close()
        connection.close()
        return jsonify({"error": str(e)}), 500

# Fetch upcoming evaluation deadlines
@app.route("/evaluations/upcoming", methods=["GET"])
def get_upcoming_evaluations():
    connection = get_db_connection()
    if connection is None:
        return jsonify({"error": "Database connection failed"}), 500
    try:
        cursor = connection.cursor(dictionary=True)
        query = """
        SELECT ComponentID, CourseCode, ComponentName, StartDate, EndDate
        FROM GradedComponents
        WHERE StartDate >= CURDATE()
        ORDER BY StartDate
        """
        cursor.execute(query)
        upcoming_evaluations = cursor.fetchall()
        cursor.close()
        connection.close()
        return jsonify(upcoming_evaluations)
    except Error as e:
        logger.error(f"Error fetching upcoming evaluations: {e}")
        cursor.close()
        connection.close()
        return jsonify({"error": str(e)}), 500

@app.route('/dashboard', methods=['GET'])
def dashboard_data():
    connection = get_db_connection()
    if connection is None:
        return jsonify({"error": "Database connection failed"}), 500
    cursor = connection.cursor(dictionary=True)

    # Get the student's roll number from the request args (query parameters)
    roll_number = request.args.get('roll_number')
    if not roll_number:
        return jsonify({"error": "Roll number is required"}), 400

    # Fetch user info
    cursor.execute("""
        SELECT Name, RollNumber, PredictedGrades, PredictedSGPA, CurrentCGPA 
        FROM Students 
        WHERE RollNumber = %s
    """, (roll_number,))
    student = cursor.fetchone()

    if student is None:
        return jsonify({"error": "Student not found"}), 404

    # Fetch active courses count
    cursor.execute("""
        SELECT COUNT(*) AS course_count
        FROM Enrolls
        JOIN Courses ON Enrolls.CourseCode = Courses.CourseCode
        WHERE Enrolls.RollNumber = %s
    """, (roll_number,))
    courses_result = cursor.fetchone()
    courses = courses_result['course_count'] if courses_result else 0

    # Fetch achievements count (badges)
    cursor.execute("""
        SELECT COUNT(*) AS badge_count
        FROM GradedComponents
        JOIN StudentComponentScores ON GradedComponents.ComponentID = StudentComponentScores.ComponentID
        WHERE StudentComponentScores.RollNumber = %s AND StudentComponentScores.Score >= 60
    """, (roll_number,))
    badges_result = cursor.fetchone()
    badges = badges_result['badge_count'] if badges_result else 0

    # Fetch upcoming deadlines
    cursor.execute("""
        SELECT GradedComponents.ComponentName AS Title, 
               GradedComponents.CourseCode, 
               GradedComponents.EndDate, 
               Courses.Name AS CourseName
        FROM GradedComponents
        JOIN Courses ON GradedComponents.CourseCode = Courses.CourseCode
        WHERE GradedComponents.EndDate > CURDATE()
        ORDER BY GradedComponents.EndDate ASC
    """)
    deadlines = cursor.fetchall()

    # Fetch recent activity (grades assigned to the student)
    cursor.execute("""
        SELECT g.Grade, g.CourseCode, s.Name AS StudentName, g.AssignerID, c.Name AS CourseName
        FROM Assigns_Grades g
        JOIN Students s ON s.RollNumber = g.RollNumber
        JOIN Courses c ON c.CourseCode = g.CourseCode
        WHERE g.RollNumber = %s ORDER BY g.AssignerID DESC LIMIT 5
    """, (roll_number,))
    activity = cursor.fetchall()

    # Prepare response data
    data = {
        "user": student['Name'],
        "roll_number": student['RollNumber'],
        "predicted_sgpa": student['PredictedSGPA'],
        "current_cgpa": student['CurrentCGPA'],
        "progress": {
            "predicted_sgpa": (student['PredictedSGPA'] / 10) * 100 if student['PredictedSGPA'] else 8.2,
            "current_cgpa": (student['CurrentCGPA'] / 10) * 100 if student['CurrentCGPA'] else 8.0
        },
        "courses": courses,
        "badges": badges,
        "deadlines": [{"Title": deadline['Title'], "CourseName": deadline['CourseName'], "EndDate": deadline['EndDate']} for deadline in deadlines],
        "activity": [{"Grade": activity_item['Grade'], "CourseCode": activity_item['CourseCode'], "CourseName": activity_item['CourseName'], "AssignerID": activity_item['AssignerID']} for activity_item in activity],
    }

    cursor.close()
    return jsonify(data)

# Get instructor dashboard data
@app.route('/instructor/dashboard', methods=['GET'])
def instructor_dashboard():
    instructor_id = 1
    connection = get_db_connection()
    if connection is None:
        return jsonify({"error": "Database connection failed"}), 500
    cursor = connection.cursor(dictionary=True)

    # Get the instructor's ID from the request args (query parameters)
    # instructor_id = request.args.get('instructor_id')
    # if not instructor_id:
    #     return jsonify({"error": "Instructor ID is required"}), 400

    try:
        # Fetch instructor info
        cursor.execute("""
            SELECT Name, InstructorID 
            FROM Instructors 
            WHERE InstructorID = %s
        """, (instructor_id,))
        instructor = cursor.fetchone()

        if instructor is None:
            return jsonify({"error": "Instructor not found"}), 404

        # Fetch the instructor's courses
        cursor.execute("""
            SELECT c.CourseCode, c.Name AS CourseName, COUNT(e.RollNumber) AS EnrolledStudents
            FROM Teaches t
            JOIN Courses c ON t.CourseCode = c.CourseCode
            LEFT JOIN Enrolls e ON e.CourseCode = c.CourseCode
            WHERE t.InstructorID = %s
            GROUP BY c.CourseCode
        """, (instructor_id,))
        courses = cursor.fetchall()

        # Fetch recent course activity (student performance)
        cursor.execute("""
            SELECT g.CourseCode, AVG(g.Grade) AS AverageGrade, COUNT(g.RollNumber) AS TotalAssignments
            FROM Assigns_Grades g
            WHERE g.CourseCode IN (SELECT c.CourseCode FROM Teaches t JOIN Courses c ON t.CourseCode = c.CourseCode WHERE t.InstructorID = %s)
            GROUP BY g.CourseCode
        """, (instructor_id,))
        performance = cursor.fetchall()

        # Fetch upcoming deadlines for the instructor's courses
        cursor.execute("""
            SELECT gc.ComponentName, gc.EndDate, c.Name AS CourseName
            FROM GradedComponents gc
            JOIN Courses c ON gc.CourseCode = c.CourseCode
            WHERE c.ProfessorID = %s AND gc.EndDate > CURDATE()
            ORDER BY gc.EndDate
        """, (instructor_id,))
        deadlines = cursor.fetchall()

        # Prepare response data
        data = {
            "instructor": instructor['Name'],
            "courses": [
                {
                    "CourseCode": course['CourseCode'],
                    "CourseName": course['CourseName'],
                    "EnrolledStudents": course['EnrolledStudents'],
                    "AverageGrade": next((p['AverageGrade'] for p in performance if p['CourseCode'] == course['CourseCode']), None),
                    "TotalAssignments": next((p['TotalAssignments'] for p in performance if p['CourseCode'] == course['CourseCode']), None),
                }
                for course in courses
            ],
            "deadlines": [{"ComponentName": deadline['ComponentName'], "CourseName": deadline['CourseName'], "EndDate": deadline['EndDate']} for deadline in deadlines]
        }

        cursor.close()
        return jsonify(data)

    except Error as e:
        logger.error(f"Error fetching instructor dashboard data: {e}")
        cursor.close()
        connection.close()
        return jsonify({"error": str(e)}), 500

@app.route('/insert-graded-components', methods=['POST'])
def insert_graded_components():
    data = request.json  # Assuming you send the data as JSON in the request body
    course_code = data.get('courseCode')
    components = data.get('components')  # Array of component names and percentages

    if not course_code or not components:
        return jsonify({"error": "Invalid input"}), 400

    # Connect to the database
    connection = get_db_connection()
    if connection is None:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = connection.cursor()

    try:
        # Insert the graded components into the table
        for component in components:
            cursor.execute('''
                INSERT INTO GradedComponents (CourseCode, ComponentName, Percentage)
                VALUES (%s, %s, %s)
            ''', (course_code, component['name'], component['percentage']))

        # Commit the transaction
        connection.commit()
        return jsonify({"message": "Graded components inserted successfully"}), 200

    except Exception as e:
        connection.rollback()
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        connection.close()

@app.route('/instructor/graded-components', methods=['GET'])
def instructor_graded_components():
    connection = get_db_connection()
    if connection is None:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = connection.cursor(dictionary=True)
    
    # Get the courses for instructor with id 1 (Hardcoded for testing)
    instructor_id = 1  
    cursor.execute("""
        SELECT c.CourseCode, c.Name AS CourseName
        FROM Courses c
        JOIN Teaches t ON c.CourseCode = t.CourseCode
        WHERE t.InstructorID = %s
    """, (instructor_id,))
    courses = cursor.fetchall()

    if not courses:
        return jsonify({"error": "No courses found for the instructor"}), 404

    graded_components = []

    # Get graded components for each course
    for course in courses:
        cursor.execute("""
            SELECT ComponentName, Percentage
            FROM GradedComponents
            WHERE CourseCode = %s
        """, (course['CourseCode'],))
        components = cursor.fetchall()
        
        graded_components.append({
            "course": course["CourseName"],
            "courseCode": course["CourseCode"],
            "components": components
        })

    return jsonify({"graded_components": graded_components}), 200

# Main entry point
if __name__ == "__main__":
    app.run(debug=True)