const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run(`
    CREATE TABLE Spreadsheet (
      id TEXT PRIMARY KEY
    )
  `);

  db.run(`
    CREATE TABLE Cell (
      id TEXT PRIMARY KEY,
      spreadsheet_id TEXT,
      cell_id TEXT,
      value TEXT,
      formula_string TEXT
    )
  `);

  db.run(`
    CREATE TABLE CellDependency (
      id TEXT PRIMARY KEY,
      spreadsheet_id TEXT,
      cell_id TEXT,
      depends_on TEXT
    )
  `);
});

module.exports = db;
