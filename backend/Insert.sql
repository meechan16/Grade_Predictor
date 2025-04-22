-- Inserting Departments
INSERT INTO Departments (DeptID, Name) VALUES 
(1, 'Computer Science and Engineering'),
(2, 'Electronics and Communications Engineering'),
(3, 'Mathematics'),
(4, 'Social Sciences and Humanities');

-- Inserting Instructors
INSERT INTO Instructors (InstructorID, Name, DeptID) VALUES 
(1, 'Dr. Ahuja', 1),
(2, 'Dr. Kapoor', 2),
(3, 'Dr. Mehta', 3),
(4, 'Dr. Singh', 4);

-- Inserting Students
INSERT INTO Students (RollNumber, Name, Branch, Batch, PredictedGrades, PredictedSGPA, CurrentCGPA) VALUES 
('2020UCP0012', 'Devaj Rathore', 'CSE', 2020, NULL, NULL, NULL),
('2020UCP0002', 'Manan Sharma', 'CSE', 2020, NULL, NULL, NULL),
('2020UEC0005', 'Ananya Jain', 'ECE', 2020, NULL, NULL, NULL),
('2020UMT0008', 'Rishi Gupta', 'MTH', 2020, NULL, NULL, NULL),
('2020USS0009', 'Sneha Verma', 'SSH', 2020, NULL, NULL, NULL),
('2020UCP0015', 'Nikita Yadav', 'CSE', 2020, NULL, NULL, NULL);

-- Inserting Student Users
INSERT INTO StudentUsers (user_id, password_hash, email) VALUES
('2020UCP0012', 'hashed_password_1', 'devaj.rathore@iiitd.ac.in'),
('2020UCP0002', 'hashed_password_2', 'manan.sharma@iiitd.ac.in'),
('2020UEC0005', 'hashed_password_3', 'ananya.jain@iiitd.ac.in'),
('2020UMT0008', 'hashed_password_4', 'rishi.gupta@iiitd.ac.in'),
('2020USS0009', 'hashed_password_5', 'sneha.verma@iiitd.ac.in'),
('2020UCP0015', 'hashed_password_6', 'nikita.yadav@iiitd.ac.in');

-- Inserting Instructor Users
INSERT INTO InstructorUsers (user_id, password_hash, email) VALUES
(1, 'hashed_password_7', 'ahuja@iiitd.ac.in'),
(2, 'hashed_password_8', 'kapoor@iiitd.ac.in'),
(3, 'hashed_password_9', 'mehta@iiitd.ac.in'),
(4, 'hashed_password_10', 'singh@iiitd.ac.in');

-- Inserting Courses
INSERT INTO Courses (CourseCode, Name, ProfessorID, GradingScheme) VALUES 
('CSE101', 'Intro to Programming', 1, 'linear'),
('CSE201', 'Data Structures', 1, 'linear'),
('ECE101', 'Basic Electronics', 2, 'linear'),
('MTH101', 'Calculus I', 3, 'linear'),
('SSH101', 'Critical Thinking', 4, 'linear');

-- Inserting Instructor-Course Assignments
INSERT INTO Teaches (InstructorID, CourseCode) VALUES 
(1, 'CSE101'),
(1, 'CSE201'),
(2, 'ECE101'),
(3, 'MTH101'),
(4, 'SSH101');

-- Inserting Enrollments
INSERT INTO Enrolls (RollNumber, CourseCode, Eligibility, Capacity) VALUES 
('2020UCP0012', 'CSE101', TRUE, 50),
('2020UCP0012', 'CSE201', TRUE, 50),
('2020UCP0002', 'CSE101', TRUE, 50),
('2020UEC0005', 'ECE101', TRUE, 50),
('2020UMT0008', 'MTH101', TRUE, 50),
('2020USS0009', 'SSH101', TRUE, 50),
('2020UCP0015', 'CSE201', TRUE, 50),
('2020UCP0015', 'SSH101', TRUE, 50);

-- Inserting TA Assignments
INSERT INTO Is_TA_Of (RollNumber, CourseCode) VALUES 
('2020UCP0012', 'CSE101'),
('2020UCP0002', 'CSE201'),
('2020UEC0005', 'ECE101');

-- Inserting Grade Components
INSERT INTO GradedComponents (CourseCode, ComponentName, Percentage) VALUES 
('CSE101', 'Assignment 1', 10),
('CSE101', 'Midterm', 30),
('CSE101', 'Endterm', 60),
('CSE201', 'Lab Work', 20),
('CSE201', 'Project', 30),
('CSE201', 'Endterm', 50),
('ECE101', 'Quiz', 20),
('ECE101', 'Lab', 30),
('ECE101', 'Endterm', 50);

-- Inserting Grades (only one grade per student and <= 10)
INSERT INTO Assigns_Grades (AssignerID, RollNumber, CourseCode, Grade) VALUES 
(1, '2020UCP0012', 'CSE101', 9.5),
(1, '2020UCP0002', 'CSE101', 8.0),
(1, '2020UCP0012', 'CSE201', 7.5),
(1, '2020UCP0015', 'CSE201', 8.0),
(2, '2020UEC0005', 'ECE101', 9.0);