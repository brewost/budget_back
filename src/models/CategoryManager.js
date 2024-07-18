const AbstractManager = require("./AbstractManager");

class CategoryManager extends AbstractManager {
  constructor() {
    super({ table: "Category" });
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

  async create(title) {
    const [result] = await this.database.query(
      `INSERT INTO ${this.table} (title) VALUES (?)`,
      [title]
    );
    return result;
  }

  async delete(id) {
    const [result] = await this.database.query(
      `DELETE FROM ${this.table} WHERE id = ?`,
      [id]
    );
    return result;
  }

  async update(title, id) {
    const [result] = await this.database.query(
      `UPDATE ${this.table} SET title = ? WHERE id = ?`,
      [title, id]
    );
    return result;
  }
}

module.exports = CategoryManager;