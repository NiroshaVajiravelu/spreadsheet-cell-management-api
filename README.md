# 📊 Spreadsheet Cell Management API

A backend system to manage spreadsheet-style cell values, formulas, dependencies, and recalculation using topological sorting.

---

## ✅ Features

- Set direct values to cells
- Store and parse formulas (e.g., `=A1+B1`)
- Track dependencies between cells
- Retrieve dependent and precedent cells
- Recalculate affected cells using topological sort
- Detect circular dependencies

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- SQLite (in-memory)
- Body-parser

---

## 🚀 API Endpoints

| Method | Endpoint                                               | Description                            |
|--------|--------------------------------------------------------|----------------------------------------|
| POST   | `/spreadsheets/:sheetId/cells/:cellId/value`           | Set direct cell value                  |
| POST   | `/spreadsheets/:sheetId/cells/:cellId/formula`         | Set formula and update dependencies    |
| GET    | `/spreadsheets/:sheetId/cells/:cellId`                 | Get cell state                         |
| GET    | `/spreadsheets/:sheetId/cells/:cellId/dependents`      | Get dependent cells                    |
| GET    | `/spreadsheets/:sheetId/cells/:cellId/precedents`      | Get precedent cells                    |
| GET    | `/spreadsheets/:sheetId/recalculate-order?changed_cell_id=A1` | Get recalculation order with topological sort |

---

## 📦 How to Run

### Prerequisite:
- Node.js installed

### Commands:

```bash
npm install
node app.js


**### Commands:**

**Nirosha V**  
📧 [niroshavna21@gmail.com](mailto:niroshavna21@gmail.com)  
🎯 Think41 – Full Stack Engineer (Entry Level) Interview Submission  
🗓️ July 23, 2025

