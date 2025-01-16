
CREATE DATABASE beebox_washing;
USE beebox_washing;

CREATE TABLE machines (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    status BOOLEAN DEFAULT FALSE,
    time INT DEFAULT 10,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE usage_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    machine_id INT,
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP,
    status ENUM('completed', 'interrupted') DEFAULT NULL,
    FOREIGN KEY (machine_id) REFERENCES machines(id)
);

INSERT INTO machines (name, status, time) VALUES
    ('เครื่องซักผ้า 1', FALSE, 10),
    ('เครื่องซักผ้า 2', FALSE, 10),
    ('เครื่องซักผ้า 3', FALSE, 10),
    ('เครื่องซักผ้า 4', FALSE, 10);