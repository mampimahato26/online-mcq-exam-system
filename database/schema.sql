-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS `mcq_exam_system`;
USE `mcq_exam_system`;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'examiner', 'student') NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Exams Table
CREATE TABLE IF NOT EXISTS `exams` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `duration` INT NOT NULL, -- duration in minutes
  `examiner_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`examiner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Questions Table
CREATE TABLE IF NOT EXISTS `questions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `exam_id` INT NOT NULL,
  `question_text` TEXT NOT NULL,
  `option_a` TEXT NOT NULL,
  `option_b` TEXT NOT NULL,
  `option_c` TEXT NOT NULL,
  `option_d` TEXT NOT NULL,
  `correct_answer` CHAR(1) NOT NULL, -- 'A', 'B', 'C', or 'D'
  FOREIGN KEY (`exam_id`) REFERENCES `exams` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Results Table
CREATE TABLE IF NOT EXISTS `results` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `exam_id` INT NOT NULL,
  `score` INT NOT NULL,
  `correct_answers` INT NOT NULL,
  `wrong_answers` INT NOT NULL,
  `percentage` DECIMAL(5, 2) NOT NULL,
  `submitted_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`exam_id`) REFERENCES `exams` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed Sample Users
-- Passwords are hashed with bcrypt (rounds=10)
-- admin123 -> $2b$10$wKz0b9lDqVnO5D1lqK12I.p3PZgD5qZgB8o5c1Hw3.D2kR9uW3Oxe
-- examiner123 -> $2b$10$uA3fG.c7iX7/3Fz6oU3jCeW8f2H3Gj1M7.Tj/PZl4pC2W7L3eWzN6
-- student123 -> $2b$10$8VbTqN7u1dK3o5C8kH9jGeT7Rz6e1M5Xj/F6pW3kG3d2D7L8eT2W6

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`) VALUES
(1, 'System Admin', 'admin@exam.com', '$2b$10$wKz0b9lDqVnO5D1lqK12I.p3PZgD5qZgB8o5c1Hw3.D2kR9uW3Oxe', 'admin'),
(2, 'Professor Smith', 'examiner@exam.com', '$2b$10$uA3fG.c7iX7/3Fz6oU3jCeW8f2H3Gj1M7.Tj/PZl4pC2W7L3eWzN6', 'examiner'),
(3, 'John Doe', 'student@exam.com', '$2b$10$8VbTqN7u1dK3o5C8kH9jGeT7Rz6e1M5Xj/F6pW3kG3d2D7L8eT2W6', 'student')
ON DUPLICATE KEY UPDATE `id`=`id`;

-- Seed Sample Exam
INSERT INTO `exams` (`id`, `title`, `duration`, `examiner_id`) VALUES
(1, 'Computer Science Basics', 10, 2)
ON DUPLICATE KEY UPDATE `id`=`id`;

-- Seed 10 Questions for the sample exam
INSERT INTO `questions` (`id`, `exam_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_answer`) VALUES
(1, 1, 'Which of the following is NOT an operating system?', 'Windows', 'Linux', 'Oracle', 'macOS', 'C'),
(2, 1, 'In database management systems (DBMS), what does ACID stand for?', 'Atomicity, Consistency, Isolation, Durability', 'Active, Concurrent, Independent, Decentralized', 'Access, Control, Integration, Distribution', 'Algorithm, Computation, Instruction, Data', 'A'),
(3, 1, 'What is the default port number for HTTP connections?', '21', '80', '443', '8080', 'B'),
(4, 1, 'Which data structure uses the LIFO (Last In First Out) principle?', 'Queue', 'Linked List', 'Stack', 'Tree', 'C'),
(5, 1, 'Which of the following programming languages is compiled rather than interpreted?', 'Python', 'C++', 'JavaScript', 'Ruby', 'B'),
(6, 1, 'What is the primary function of the Router in a computer network?', 'To display web pages', 'To connect a computer to a monitor', 'To route data packets across networks', 'To store files on a server', 'C'),
(7, 1, 'Which type of memory is volatile and loses its contents when the power is turned off?', 'ROM', 'Flash Memory', 'Hard Disk', 'RAM', 'D'),
(8, 1, 'What does HTML stand for?', 'HyperText Markup Language', 'HighTransfer Machine Language', 'Hyperlink Text Management List', 'Home Tool Markup Language', 'A'),
(9, 1, 'In computer science, what is an algorithm?', 'A hardware component', 'A step-by-step set of instructions for solving a problem', 'A database query language', 'A type of operating system', 'B'),
(10, 1, 'Which protocol is used to securely transfer files over the internet?', 'SFTP', 'FTP', 'SMTP', 'HTTP', 'A')
ON DUPLICATE KEY UPDATE `id`=`id`;
