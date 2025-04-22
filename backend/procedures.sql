DELIMITER //

-- Retrieve Student Details with Enrolled Courses
CREATE PROCEDURE get_student_courses ()
BEGIN
  SELECT s.RollNumber, s.Name, s.Branch, e.CourseCode, c.Name AS CourseName
  FROM Students s
  JOIN Enrolls e ON s.RollNumber = e.RollNumber
  JOIN Courses c ON e.CourseCode = c.CourseCode;
END //

-- Retrieve Students with Instructors
CREATE PROCEDURE get_students_with_instructors ()
BEGIN
  SELECT s.RollNumber, s.Name AS StudentName, c.Name AS CourseName, i.Name AS InstructorName
  FROM Students s
  JOIN Enrolls e ON s.RollNumber = e.RollNumber
  JOIN Courses c ON e.CourseCode = c.CourseCode
  JOIN Instructors i ON c.ProfessorID = i.InstructorID;
END //

-- Get All Courses Assigned to a Specific Student
CREATE PROCEDURE get_courses_for_student (IN student_roll VARCHAR(20))
BEGIN
  SELECT s.RollNumber, s.Name AS StudentName, c.CourseCode, c.Name AS CourseName
  FROM Students s
  JOIN Enrolls e ON s.RollNumber = e.RollNumber
  JOIN Courses c ON e.CourseCode = c.CourseCode
  WHERE s.RollNumber = student_roll;
END //

-- Get Students Who Are Also TAs
CREATE PROCEDURE get_students_as_ta ()
BEGIN
  SELECT DISTINCT s.RollNumber, s.Name 
  FROM Students s
  JOIN Is_TA_Of t ON s.RollNumber = t.RollNumber;
END //

-- Fetch Students Who Have Not Enrolled in Any Course
CREATE PROCEDURE get_students_no_enrollment ()
BEGIN
  SELECT s.RollNumber, s.Name
  FROM Students s
  LEFT JOIN Enrolls e ON s.RollNumber = e.RollNumber
  WHERE e.CourseCode IS NULL;
END //

-- Find the Top 3 Students with the Highest Current CGPA
CREATE PROCEDURE get_top_students_by_cgpa ()
BEGIN
  SELECT RollNumber, Name, CurrentCGPA
  FROM Students
  ORDER BY CurrentCGPA DESC
  LIMIT 3;
END //

-- Fetch Course Details with Instructor Name
CREATE PROCEDURE get_course_instructors ()
BEGIN
  SELECT c.CourseCode, c.Name AS CourseName, i.Name AS InstructorName
  FROM Courses c
  JOIN Instructors i ON c.ProfessorID = i.InstructorID;
END //

-- Retrieve TA Assignments for a Specific Course
CREATE PROCEDURE get_ta_assignments_for_course (IN course_code VARCHAR(10))
BEGIN
  SELECT t.RollNumber, s.Name AS TA_Name, c.CourseCode, c.Name AS CourseName
  FROM Is_TA_Of t
  JOIN Students s ON t.RollNumber = s.RollNumber
  JOIN Courses c ON t.CourseCode = c.CourseCode
  WHERE c.CourseCode = course_code;
END //

-- Retrieve Instructors with Their Courses and Enrolled Student Count
CREATE PROCEDURE get_instructor_course_enrollment ()
BEGIN
  SELECT i.InstructorID, i.Name AS InstructorName, c.CourseCode, c.Name AS CourseName, COUNT(e.RollNumber) AS EnrolledStudents
  FROM Instructors i
  JOIN Teaches t ON i.InstructorID = t.InstructorID
  JOIN Courses c ON t.CourseCode = c.CourseCode
  LEFT JOIN Enrolls e ON c.CourseCode = e.CourseCode
  GROUP BY i.InstructorID, i.Name, c.CourseCode, c.Name;
END //

-- Aggregate: Average Grade per Course
CREATE PROCEDURE get_average_grade_per_course ()
BEGIN
  SELECT CourseCode, AVG(Grade) AS AverageGrade
  FROM Assigns_Grades
  GROUP BY CourseCode;
END //

-- Highest Grade in Each Course
CREATE PROCEDURE get_highest_grade_per_course ()
BEGIN
  SELECT CourseCode, MAX(Grade) AS HighestGrade
  FROM Assigns_Grades
  GROUP BY CourseCode
  HAVING MAX(Grade) >= 9.0;
END //

-- Retrieve Students with Above-Average Grades
CREATE PROCEDURE get_students_above_average_grades ()
BEGIN
  SELECT RollNumber, Name, CurrentCGPA
  FROM Students
  WHERE CurrentCGPA > (SELECT AVG(CurrentCGPA) FROM Students);
END //

-- Retrieve Courses where at least one Student Scored Below 40%
CREATE PROCEDURE get_courses_with_below_40_score ()
BEGIN
  SELECT DISTINCT c.CourseCode, c.Name
  FROM Courses c
  JOIN GradedComponents gc ON c.CourseCode = gc.CourseCode
  JOIN StudentComponentScores scs ON gc.ComponentID = scs.ComponentID
  WHERE scs.Score < 40.00;
END //

-- Get Student Performance Analytics (Average Component Score per Student)
CREATE PROCEDURE get_student_performance_analytics ()
BEGIN
  SELECT s.RollNumber, s.Name, AVG(scs.Score) AS AverageScore
  FROM Students s
  JOIN StudentComponentScores scs ON s.RollNumber = scs.RollNumber
  GROUP BY s.RollNumber, s.Name;
END //

-- Get Average Component Score per Course for Each Student
CREATE PROCEDURE get_average_component_score_per_course ()
BEGIN
  SELECT s.RollNumber, s.Name, c.CourseCode, c.Name AS CourseName, AVG(scs.Score) AS AvgComponentScore
  FROM Students s
  JOIN Enrolls e ON s.RollNumber = e.RollNumber
  JOIN Courses c ON e.CourseCode = c.CourseCode
  JOIN GradedComponents gc ON c.CourseCode = gc.CourseCode
  JOIN StudentComponentScores scs ON gc.ComponentID = scs.ComponentID AND s.RollNumber = scs.RollNumber
  GROUP BY s.RollNumber, s.Name, c.CourseCode, c.Name;
END //

-- Retrieve Courses with an Average Predicted SGPA Above 8.0
CREATE PROCEDURE get_courses_with_high_predicted_sgpa ()
BEGIN
  SELECT c.CourseCode, c.Name AS CourseName, AVG(s.PredictedSGPA) AS AvgPredictedSGPA
  FROM Courses c
  JOIN Enrolls e ON c.CourseCode = e.CourseCode
  JOIN Students s ON e.RollNumber = s.RollNumber
  GROUP BY c.CourseCode, c.Name
  HAVING AVG(s.PredictedSGPA) > 8.0;
END //

-- List All Courses with Their Grading Schemes
CREATE PROCEDURE get_all_courses_with_grading_schemes ()
BEGIN
  SELECT CourseCode, Name, GradingScheme 
  FROM Courses;
END //

-- List Upcoming Evaluation Deadlines
CREATE PROCEDURE get_upcoming_evaluation_deadlines ()
BEGIN
  SELECT ComponentID, CourseCode, ComponentName, StartDate, EndDate
  FROM GradedComponents
  WHERE StartDate >= CURDATE()
  ORDER BY StartDate;
END //

-- Retrieve Upcoming Graded Components for a Specific Course
CREATE PROCEDURE get_upcoming_graded_components_for_course (IN course_code VARCHAR(10))
BEGIN
  SELECT ComponentID, ComponentName, StartDate, EndDate, Percentage
  FROM GradedComponents
  WHERE CourseCode = course_code AND StartDate > CURDATE()
  ORDER BY StartDate;
END //

DELIMITER ;