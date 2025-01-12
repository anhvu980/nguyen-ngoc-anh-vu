import sqlite3 from "sqlite3";

// Initialize SQLite database connection
const db = new sqlite3.Database("./db.sqlite");

interface Resource {
  id: number;
  name: string;
  description: string;
}

export class ResourceModel {
  static createTable() {
    db.run("CREATE TABLE IF NOT EXISTS resources (id INTEGER PRIMARY KEY, name TEXT, description TEXT)");
  }

  static create(resource: Resource, callback: (err: Error | null, result: any) => void) {
    const { name, description } = resource;
    db.run("INSERT INTO resources (name, description) VALUES (?, ?)", [name, description], callback);
  }

  static getAll(filters: { name?: string; description?: string }, callback: (err: Error | null, rows: Resource[]) => void) {
    const { name, description } = filters;
    let query = "SELECT * FROM resources WHERE 1=1";
    const params: string[] = [];
    
    if (name) {
      query += " AND name LIKE ?";
      params.push(`%${name}%`);
    }

    if (description) {
      query += " AND description LIKE ?";
      params.push(`%${description}%`);
    }

    db.all(query, params, callback);
  }

  static getById(id: number, callback: (err: Error | null, row: Resource | undefined) => void) {
    db.get("SELECT * FROM resources WHERE id = ?", [id], callback);
  }

  static update(id: number, resource: Resource, callback: (err: Error | null) => void) {
    const { name, description } = resource;
    db.run("UPDATE resources SET name = ?, description = ? WHERE id = ?", [name, description, id], callback);
  }

  static delete(id: number, callback: (err: Error | null) => void) {
    db.run("DELETE FROM resources WHERE id = ?", [id], callback);
  }
}

ResourceModel.createTable();
