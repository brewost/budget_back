const tables = require("../../tables");
const LedgerManager = require('../models/LedgerManager');
const ledgerManager = new LedgerManager();


const browseLedger = async (req, res) => {
  try {
    const getAllTransactions = await ledgerManager.readAllWithCategories();
    res.json(getAllTransactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
const browseLedgerTotal = async (req, res) => {
  try {
    const allLedgerEntries = await ledgerManager.readAll();
    // Extracting required fields money and debit
    const simplifiedEntries = allLedgerEntries.map(entry => ({
      money: entry.money,
      debit: entry.debit
    }));
    res.json(simplifiedEntries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const readLedger = async (req, res) => {
  try {
    const parseId = parseInt(req.params.id, 10);
    const getTransaction = await ledgerManager.readWithCategory(parseId);
    if (getTransaction) {
      res.json(getTransaction);
    } else {
      res.status(404).json({ message: 'Transaction not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const insertLedger = async (req, res) => {
  let connection;
  try {
    const { name, money, debit, category_id, newCategoryTitle } = req.body;

    console.log('Received request with body:', req.body);

    connection = await tables.Ledger.database.getConnection();
    await connection.beginTransaction();

    console.log('Inserting into Ledger table with:', { name, money, debit });
    const insertTransaction = await connection.query(
      `INSERT INTO Ledger (name, money, debit) VALUES (?, ?, ?)`,
      [name, money, debit]
    );

    if (insertTransaction[0].affectedRows) {
      const ledgerId = insertTransaction[0].insertId;

      // Determine finalCategoryId based on category_id or newCategoryTitle
      let finalCategoryId = parseInt(category_id, 10); // Parse as integer

      console.log('Final Category ID:', finalCategoryId);

      // Check if categoryId is not provided but newCategoryTitle is
      if (isNaN(finalCategoryId) && newCategoryTitle) {
        console.log('Creating new category with title:', newCategoryTitle);
        const insertCategory = await connection.query(
          `INSERT INTO Category (title) VALUES (?)`,
          [newCategoryTitle]
        );
        finalCategoryId = insertCategory[0].insertId;
        console.log('Newly created Category ID:', finalCategoryId);
      }

      // Insert into Ledger_cat table if finalCategoryId exists
      if (!isNaN(finalCategoryId)) {
        console.log('Inserting into Ledger_cat table with:', { ledgerId, finalCategoryId });
        await connection.query(
          `INSERT INTO Ledger_cat (ledger_id, category_id) VALUES (?, ?)`,
          [ledgerId, finalCategoryId]
        );
      }

      await connection.commit();
      console.log('Transaction added successfully');
      res.status(201).json({ message: 'Transaction added successfully' });
    } else {
      await connection.rollback();
      console.log('Failed to add Transaction');
      res.status(404).json({ message: 'Failed to add Transaction' });
    }
  } catch (err) {
    if (connection) {
      await connection.rollback();
    }
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};







const deleteLedger = async (req, res) => {
  let connection;
  try {
    const parseId = parseInt(req.params.id, 10);

    // Start a transaction
    connection = await tables.Ledger.database.getConnection();
    await connection.beginTransaction();

    // Delete from Ledger_cat table
    await connection.query(`DELETE FROM Ledger_cat WHERE ledger_id = ?`, [parseId]);

    // Delete from Ledger table
    const deleteTransaction = await connection.query(`DELETE FROM Ledger WHERE id = ?`, [parseId]);

    // Check if transaction was deleted
    if (deleteTransaction[0].affectedRows) {
      // Commit the transaction if successful
      await connection.commit();
      res.status(204).json({ message: 'Transaction deleted successfully' });
    } else {
      // Rollback the transaction if transaction not found
      await connection.rollback();
      res.status(404).json({ message: 'Transaction not found' });
    }
  } catch (err) {
    if (connection) {
      // Rollback transaction on error
      await connection.rollback();
    }
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (connection) {
      // Release connection back to pool
      connection.release();
    }
  }
};

const updateLedger = async (req, res) => {
  let connection;
  try {
    const { name, money, debit, category_id } = req.body; // Corrected to match the request body
    const ledgerId = parseInt(req.params.id, 10);

    // Get a database connection and start a transaction
    connection = await tables.Ledger.database.getConnection();
    await connection.beginTransaction();

    // Update ledger transaction
    const updateTransaction = await tables.Ledger.update(name, money, debit, ledgerId, category_id); // Corrected to use category_id

    if (updateTransaction.affectedRows > 0) {
      // Commit the transaction if successful
      await connection.commit();
      console.log('Transaction updated successfully');
      res.status(200).json({ message: 'Transaction updated successfully' });
    } else {
      // Rollback the transaction if update fails
      await connection.rollback();
      console.log('Transaction not found');
      res.status(404).json({ message: 'Transaction not found' });
    }
  } catch (err) {
    if (connection) {
      await connection.rollback(); // Rollback on error
    }
    console.error('Error updating transaction:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (connection) {
      connection.release(); // Release connection back to the pool
    }
  }
};


module.exports = {
  browseLedger,
  readLedger,
  insertLedger,
  deleteLedger,
  updateLedger,
  browseLedgerTotal,
};




