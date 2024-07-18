const tables = require("../../tables");

const browseCategory = async (req, res) => {
  try {
    const getAllCategories = await tables.Category.readAll();
    res.json(getAllCategories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const readCategory = async (req, res) => {
  try {
    const parseId = parseInt(req.params.id, 10);
    const getCategory = await tables.Category.read(parseId);
    if (getCategory) {
      res.json(getCategory);
    } else {
      res.status(404).json({ message: ' not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const insertCategory = async (req, res) => {
  try {
    const { title } = req.body;
    const insertCategory = await tables.Category.create(title);
    if (insertCategory.affectedRows) {
      res.status(201).json({ message: 'Category added successfully' });
    } else {
      res.status(404).json({ message: 'Failed to add category' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteCategory= async (req, res) => {
  try {
    const parseId = parseInt(req.params.id, 10);
    const deleteCategory = await tables.Category.delete(parseId);
    if (deleteCategory.affectedRows) {
      res.status(204).json({ message: 'Category deleted successfully' });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { title } = req.body;
    const { id } = req.params;
    const updateCategory = await tables.Category.update(title, id);
    if (updateCategory.affectedRows) {
      res.status(200).json({ message: 'Category updated successfully' });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  browseCategory,
  readCategory,
  insertCategory,
  deleteCategory,
  updateCategory,
};