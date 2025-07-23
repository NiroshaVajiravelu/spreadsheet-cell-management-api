const express = require('express');
const db = require('../db');
const { v4: uuidv4 } = require('uuid');
const { getRecalculationOrder } = require('../utils/topologicalSort');

const router = express.Router();

// Set direct cell value
router.post('/spreadsheets/:sheetId/cells/:cellId/value', (req, res) => {
  const { sheetId, cellId } = req.params;
  const { value } = req.body;
  const cellUUID = `${sheetId}_${cellId}`;

  db.run(`
    INSERT OR REPLACE INTO Cell (id, spreadsheet_id, cell_id, value, formula_string)
    VALUES (?, ?, ?, ?, NULL)
  `, [cellUUID, sheetId, cellId, value], err => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json({ cell_id: cellId, value });
  });
});

// Set formula and update dependencies
router.post('/spreadsheets/:sheetId/cells/:cellId/formula', (req, res) => {
  const { sheetId, cellId } = req.params;
  const { formula_string } = req.body;
  const cellUUID = `${sheetId}_${cellId}`;
  const refs = formula_string.match(/[A-Z]+\d+/g) || [];

  db.serialize(() => {
    db.run(`DELETE FROM CellDependency WHERE spreadsheet_id = ? AND cell_id = ?`,
      [sheetId, cellId]);

    refs.forEach(ref => {
      db.run(`INSERT INTO CellDependency (id, spreadsheet_id, cell_id, depends_on)
        VALUES (?, ?, ?, ?)`, [uuidv4(), sheetId, cellId, ref]);
    });

    db.run(`INSERT OR REPLACE INTO Cell (id, spreadsheet_id, cell_id, value, formula_string)
      VALUES (?, ?, ?, NULL, ?)`, [cellUUID, sheetId, cellId, formula_string], err => {
      if (err) return res.status(500).json({ error: 'DB error' });
      res.json({ cell_id: cellId, formula_string });
    });
  });
});

// Get cell details
router.get('/spreadsheets/:sheetId/cells/:cellId', (req, res) => {
  const { sheetId, cellId } = req.params;
  const cellUUID = `${sheetId}_${cellId}`;
  db.get(`SELECT * FROM Cell WHERE id = ?`, [cellUUID], (err, row) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(row || {});
  });
});

// Get dependents
router.get('/spreadsheets/:sheetId/cells/:cellId/dependents', (req, res) => {
  const { sheetId, cellId } = req.params;
  db.all(`SELECT cell_id FROM CellDependency WHERE spreadsheet_id = ? AND depends_on = ?`,
    [sheetId, cellId], (err, rows) => {
      if (err) return res.status(500).json({ error: 'DB error' });
      res.json(rows.map(row => row.cell_id));
    });
});

// Get precedents
router.get('/spreadsheets/:sheetId/cells/:cellId/precedents', (req, res) => {
  const { sheetId, cellId } = req.params;
  db.all(`SELECT depends_on FROM CellDependency WHERE spreadsheet_id = ? AND cell_id = ?`,
    [sheetId, cellId], (err, rows) => {
      if (err) return res.status(500).json({ error: 'DB error' });
      res.json(rows.map(row => row.depends_on));
    });
});

// Get recalculation order
router.get('/spreadsheets/:sheetId/recalculate-order', (req, res) => {
  const { spreadsheetId } = req.params;
  const changedCellId = req.query.changed_cell_id;

  getRecalculationOrder(spreadsheetId, changedCellId, db)
    .then(result => res.json(result))
    .catch(err => res.status(400).json(err));
});

module.exports = router;
