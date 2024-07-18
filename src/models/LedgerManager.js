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
    const [row] = await this.database.query(`
      SELECT l.id, l.name, l.money, l.debit, c.id AS category_id, c.title AS category_name
      FROM Ledger l
      LEFT JOIN Ledger_cat lc ON l.id = lc.ledger_id
      LEFT JOIN Category c ON lc.category_id = c.id
      WHERE l.id = ?
    `, [id]);
    return row[0];
  }

  async readAllWithCategories() {
    const [rows] = await this.database.query(`
      SELECT l.id, l.name, l.money, l.debit, c.id AS category_id, c.title AS category_name
      FROM Ledger l
      LEFT JOIN Ledger_cat lc ON l.id = lc.ledger_id
      LEFT JOIN Category c ON lc.category_id = c.id
    `);
    return rows;
  }

  async create(name, money, debit, categoryId) {
    let connection;
    try {
      connection = await this.database.getConnection();
      await connection.beginTransaction();

      // Insert into Ledger table
      const [result1] = await connection.query(
        `INSERT INTO Ledger (name, money, debit) VALUES (?, ?, ?)`,
        [name, money, debit]
      );

      const ledgerId = result1.insertId;

      // Insert into Ledger_cat table
      if (categoryId) {
        await connection.query(
          `INSERT INTO Ledger_cat (ledger_id, category_id) VALUES (?, ?)`,
          [ledgerId, categoryId]
        );
      }

      // Commit the transaction if all operations succeed
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

    console.log(`Deleting transaction with ID: ${id}`);

    // Delete from Ledger_cat table
    console.log(`Deleting from Ledger_cat where ledger_id = ${id}`);
    await connection.query(`DELETE FROM Ledger_cat WHERE ledger_id = ?`, [id]);

    // Delete from Ledger table
    console.log(`Deleting from Ledger where id = ${id}`);
    const [result] = await connection.query(`DELETE FROM Ledger WHERE id = ?`, [id]);

    // Commit the transaction if successful
    await connection.commit();
    console.log(`Transaction with ID ${id} deleted successfully`);

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

  async update(name, money, debit, id, categoryId) {
    let connection;
    try {
      connection = await this.database.getConnection();
      await connection.beginTransaction();

      // Update Ledger table
      const [result] = await connection.query(
        `UPDATE Ledger SET name = ?, money = ?, debit = ? WHERE id = ?`,
        [name, money, debit, id]
      );

      // Update Ledger_cat table
      if (categoryId) {
        // Delete existing category mapping
        await connection.query(`DELETE FROM Ledger_cat WHERE ledger_id = ?`, [id]);

        // Insert new category mapping
        await connection.query(
          `INSERT INTO Ledger_cat (ledger_id, category_id) VALUES (?, ?)`,
          [id, categoryId]
        );
      }

      // Commit the transaction if successful
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


