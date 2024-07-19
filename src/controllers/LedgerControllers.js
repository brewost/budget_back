const tables = require("../../tables"); // Adjust path as necessary
const LedgerManager = require('../models/LedgerManager');
const ledgerManager = new LedgerManager();

const browseLedger = async (req, res) => {
  try {
    const transactions = await ledgerManager.readAllWithCategories();
    res.json(transactions);
  } catch (err) {
    console.error('Error fetching all transactions:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const browseLedgerTotal = async (req, res) => {
  try {
    const allLedgerEntries = await ledgerManager.readAll();
    const simplifiedEntries = allLedgerEntries.map(entry => ({
      money: entry.money,
      debit: entry.debit
    }));
    res.json(simplifiedEntries);
  } catch (err) {
    console.error('Error fetching total ledger entries:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const readLedger = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const transaction = await ledgerManager.readWithCategory(id);
    if (transaction.length > 0) {
      // Assuming that `readWithCategory` returns an array, process to single transaction with multiple categories
      const transformedTransaction = transaction.reduce((acc, row) => {
        if (!acc) {
          acc = { id: row.id, name: row.name, money: row.money, debit: row.debit, categories: [] };
        }
        if (row.category_id && row.category_name) {
          acc.categories.push({ id: row.category_id, name: row.category_name });
        }
        return acc;
      }, null);

      res.json(transformedTransaction);
    } else {
      res.status(404).json({ message: 'Transaction not found' });
    }
  } catch (err) {
    console.error('Error fetching transaction:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const insertLedger = async (req, res) => {
  try {
    const { name, money, debit, category_ids, newCategoryTitles } = req.body;

    let categoryIds = category_ids || [];
    if (newCategoryTitles && newCategoryTitles.length > 0) {
      for (const title of newCategoryTitles) {
        const insertCategory = await tables.Category.create(title);
        if (insertCategory.insertId) {
          categoryIds.push(insertCategory.insertId);
        }
      }
    }

    const insertTransaction = await ledgerManager.create(name, money, debit, categoryIds);

    if (insertTransaction.insertId) {
      res.status(201).json({ message: 'Transaction added successfully' });
    } else {
      res.status(400).json({ message: 'Failed to add transaction' });
    }
  } catch (err) {
    console.error('Error adding transaction:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateLedger = async (req, res) => {
  try {
    const { name, money, debit, category_ids, newCategoryTitles } = req.body;
    const { id } = req.params;

    let categoryIds = category_ids || [];
    if (newCategoryTitles && newCategoryTitles.length > 0) {
      for (const title of newCategoryTitles) {
        const insertCategory = await tables.Category.create(title);
        if (insertCategory.insertId) {
          categoryIds.push(insertCategory.insertId);
        }
      }
    }

    const updateTransaction = await ledgerManager.update(name, money, debit, id, categoryIds);

    if (updateTransaction.affectedRows) {
      res.status(200).json({ message: 'Transaction updated successfully' });
    } else {
      res.status(404).json({ message: 'Transaction not found' });
    }
  } catch (err) {
    console.error('Error updating transaction:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteLedger = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteResult = await ledgerManager.delete(id);

    if (deleteResult.affectedRows) {
      res.status(200).json({ message: 'Transaction deleted successfully' });
    } else {
      res.status(404).json({ message: 'Transaction not found' });
    }
  } catch (err) {
    console.error('Error deleting transaction:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  browseLedger,
  browseLedgerTotal,
  readLedger,
  insertLedger,
  updateLedger,
  deleteLedger,
};




