function getRecalculationOrder(sheetId, startCellId, db) {
  return new Promise((resolve, reject) => {
    const graph = {}, inDegree = {};

    db.all(`SELECT cell_id, depends_on FROM CellDependency WHERE spreadsheet_id = ?`,
      [sheetId], (err, rows) => {
        if (err) return reject({ error: 'DB error' });

        rows.forEach(({ cell_id, depends_on }) => {
          if (!graph[depends_on]) graph[depends_on] = [];
          graph[depends_on].push(cell_id);

          inDegree[cell_id] = (inDegree[cell_id] || 0) + 1;
          inDegree[depends_on] = inDegree[depends_on] || 0;
        });

        const queue = [startCellId], visited = new Set(), order = [];

        while (queue.length > 0) {
          const node = queue.shift();
          if (visited.has(node)) continue;

          visited.add(node);
          order.push(node);

          (graph[node] || []).forEach(dep => {
            inDegree[dep]--;
            if (inDegree[dep] === 0) queue.push(dep);
          });
        }

        const reachable = Object.keys(inDegree).filter(c => visited.has(c));
        if (order.length < reachable.length) {
          return reject({ error: 'cycle_detected', cells: reachable });
        }

        resolve({ order });
      });
  });
}

module.exports = { getRecalculationOrder };
