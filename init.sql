CREATE DATABASE IF NOT EXISTS todo;
USE todo;

CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE,
    password VARCHAR(255),
    token VARCHAR(500)
);

INSERT INTO users (username, password)
VALUES ('testuser', '$2b$10$nFhdSAbYNVSs1/v2cHxGue4FDBkvehJYA9W3XIARSx9s50Z6eF8uS');
