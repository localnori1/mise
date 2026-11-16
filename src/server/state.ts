// FR-10: apply the interviewer's add/update/remove operations by id, so an
// "update" replaces an item instead of duplicating it. Fields the update
// leaves out keep their value, so a partial update can't blank an item.

export type Item = { id: string; [field: string]: unknown };
export type ItemOp = Item & { op?: "add" | "update" | "remove" };

// Requirements carry no `op` in the prompt's schema, so a missing op is an
// upsert; only an explicit "add" of an existing id is an anomaly.
export function applyOps(items: Item[], ops: ItemOp[] = []): { items: Item[]; anomalies: string[] } {
  const next = [...items];
  const anomalies: string[] = [];
  for (const { op, ...item } of ops) {
    const index = next.findIndex((existing) => existing.id === item.id);
    if (op === "remove") {
      if (index === -1) anomalies.push(`remove of unknown id ${item.id}`);
      else next.splice(index, 1);
    } else if (index === -1) {
      if (op === "update") anomalies.push(`update of unknown id ${item.id}`);
      next.push(item);
    } else {
      if (op === "add") anomalies.push(`add of existing id ${item.id}`);
      next[index] = { ...next[index], ...item };
    }
  }
  return { items: next, anomalies };
}
