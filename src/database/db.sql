-- Create the Ledger table
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
    ledger_id INT,
    category_id INT,
    PRIMARY KEY (ledger_id, category_id),
    FOREIGN KEY (ledger_id) REFERENCES Ledger (id),
    FOREIGN KEY (category_id) REFERENCES Category (id)
);

-- Insert multiple rows into Ledger table
INSERT INTO
    Ledger (name, money, debit)
VALUES ('Toy Dragon', 5.99, TRUE),
    (
        'Birthday Money',
        40.00,
        FALSE
    ),
    ('Pocket Money', 10.00, FALSE),
    ('Comic', 3.50, TRUE),
    ('Ice Cream', 2.75, TRUE),
    ('Tooth fairy', 2.00, FALSE),
    ('Sold Old Toys', 12.50, FALSE),
    ('Fuggler', 5.00, TRUE),
    ('Redwall', 4.99, TRUE);

-- Insert multiple rows into Category table
INSERT INTO
    Category (title)
VALUES ('Toys'),
    ('Books'),
    ('Food'),
    ('Gifts'),
    ('Income'),
    ('Miscellaneous'),
    ('Sales'),
    ('Peluche');

-- Insert multiple rows into Ledger_cat junction table
INSERT INTO
    Ledger_cat (ledger_id, category_id)
VALUES (1, 1),
    (2, 4),
    (2, 5),
    (3, 5),
    (4, 2),
    (5, 3),
    (6, 4),
    (7, 5),
    (8, 1),
    (8, 8),
    (9, 2);