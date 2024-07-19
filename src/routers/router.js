const express = require('express');
const router = express.Router();
const {
  browseLedger,
  readLedger,
  insertLedger,
  deleteLedger,
  updateLedger,
  browseLedgerTotal,
} = require('../controllers/LedgerControllers');

const {
  browseCategory,
  readCategory,
  insertCategory,
  deleteCategory,
  updateCategory,
} = require('../controllers/CategoryControllers');

// Routes for Ledger
router.get('/ledger', browseLedger);
router.get('/ledger/total', browseLedgerTotal);
router.get('/ledger/:id', readLedger);
router.post('/ledger', insertLedger);
router.put('/ledger/:id', updateLedger);
router.delete('/ledger/:id', deleteLedger);

// Routes for Category
router.get('/category', browseCategory);
router.get('/category/:id', readCategory);
router.post('/category', insertCategory);
router.put('/category/:id', updateCategory);
router.delete('/category/:id', deleteCategory);

module.exports = router;

