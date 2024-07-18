CREATE TABLE Ledger (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    money DECIMAL(10, 2) NOT NULL,
    debit BOOL NOT NULL,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create the Category table
CREATE TABLE Category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL
);

-- Create the Ledger_cat junction table
CREATE TABLE Ledger_cat (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ledger_id INT,
    category_id INT,
    FOREIGN KEY (ledger_id) REFERENCES Ledger (id),
    FOREIGN KEY (category_id) REFERENCES Category (id)
);

-- Insert multiple rows into Ledger table
INSERT INTO
    Ledger (name, money, debit)
VALUES ('Toy Car', 5.99, TRUE),
    ('Birthday Gift', 40.00, FALSE),
    ('Allowance', 10.00, FALSE),
    ('Comic Book', 3.50, TRUE),
    ('Ice Cream', 2.75, TRUE),
    ('Found Money', 5.00, FALSE),
    ('Sold Old Toys', 12.50, FALSE),
    ('Action Figure', 12.49, TRUE),
    ('Coloring Book', 4.25, TRUE);

-- Insert multiple rows into Category table
INSERT INTO
    Category (title)
VALUES ('Toys'),
    ('Books'),
    ('Food'),
    ('Gifts'),
    ('Income'),
    ('Miscellaneous'),
    ('Sales');

-- Insert multiple rows into Ledger_cat junction table
INSERT INTO
    Ledger_cat (ledger_id, category_id)
VALUES (1, 1),
    (2, 4),
    (3, 5),
    (4, 2),
    (5, 3),
    (6, 6),
    (7, 7),
    (8, 1),
    (9, 2);