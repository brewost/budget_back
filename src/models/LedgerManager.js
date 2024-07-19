const AbstractManager = require("./AbstractManager");

class LedgerManager extends AbstractManager {
  constructor() {
    super({ table: "Ledger" });
  }

  async readAll() {
    const [rows] = await this.database.query(`SELECT * FROM ${this.table}`);
    return rows;
  }

  async read(id) {
    const [row] = await this.database.query(
      `SELECT * FROM ${this.table} WHERE id = ?`,
      [id]
    );
    return row[0];
  }

  async readWithCategory(id) {
    const [rows] = await this.database.query(`
      SELECT l.id, l.name, l.money, l.debit, c.id AS category_id, c.title AS category_name
      FROM Ledger l
      LEFT JOIN Ledger_cat lc ON l.id = lc.ledger_id
      LEFT JOIN Category c ON lc.category_id = c.id
      WHERE l.id = ?
    `, [id]);
    return rows;
  }

 async readAllWithCategories() {
  const [rows] = await this.database.query(`
    SELECT l.id, l.name, l.money, l.debit, c.id AS category_id, c.title AS category_name
    FROM Ledger l
    LEFT JOIN Ledger_cat lc ON l.id = lc.ledger_id
    LEFT JOIN Category c ON lc.category_id = c.id
  `);

  // Transform rows into transactions with categories grouped
  const transactions = rows.reduce((acc, row) => {
    const { id, name, money, debit, category_id, category_name } = row;
    let transaction = acc.find(t => t.id === id);

    if (!transaction) {
      transaction = { id, name, money, debit, categories: [] };
      acc.push(transaction);
    }

    if (category_id && category_name) {
      transaction.categories.push({ id: category_id, name: category_name });
    }

    return acc;
  }, []);

  return transactions;
}

  async create(name, money, debit, categoryIds) {
    let connection;
    try {
      connection = await this.database.getConnection();
      await connection.beginTransaction();

      const [result1] = await connection.query(
        `INSERT INTO Ledger (name, money, debit) VALUES (?, ?, ?)`,
        [name, money, debit]
      );

      const ledgerId = result1.insertId;

      if (categoryIds && categoryIds.length > 0) {
        for (const categoryId of categoryIds) {
          await connection.query(
            `INSERT INTO Ledger_cat (ledger_id, category_id) VALUES (?, ?)`,
            [ledgerId, categoryId]
          );
        }
      }

      await connection.commit();
      return result1;
    } catch (error) {
      if (connection) {
        await connection.rollback();
      }
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  async delete(id) {
    let connection;
    try {
      connection = await this.database.getConnection();
      await connection.beginTransaction();

      await connection.query(`DELETE FROM Ledger_cat WHERE ledger_id = ?`, [id]);
      const [result] = await connection.query(`DELETE FROM Ledger WHERE id = ?`, [id]);

      await connection.commit();
      return result;
    } catch (error) {
      if (connection) {
        await connection.rollback();
      }
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  async update(name, money, debit, id, categoryIds) {
    let connection;
    try {
      connection = await this.database.getConnection();
      await connection.beginTransaction();

      const [result] = await connection.query(
        `UPDATE Ledger SET name = ?, money = ?, debit = ? WHERE id = ?`,
        [name, money, debit, id]
      );

      await connection.query(`DELETE FROM Ledger_cat WHERE ledger_id = ?`, [id]);

      if (categoryIds && categoryIds.length > 0) {
        for (const categoryId of categoryIds) {
          await connection.query(
            `INSERT INTO Ledger_cat (ledger_id, category_id) VALUES (?, ?)`,
            [id, categoryId]
          );
        }
      }

      await connection.commit();
      return result;
    } catch (error) {
      if (connection) {
        await connection.rollback();
      }
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
}

module.exports = LedgerManager;



