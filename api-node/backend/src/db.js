import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

sqlite3.verbose();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isTest = process.env.NODE_ENV === "test";

const dbPath = isTest 
  ? ":memory" 
  : path.join(__dirname, "test_database.sqlite");

export const db = new sqlite3.Database(dbPath);

export const run = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });

export const all = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });

export const get = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });

// Crear tablas si no existen
export const initDb = async () => {
  await run(`
    CREATE TABLE IF NOT EXISTS usuario (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      correo TEXT NOT NULL UNIQUE,
      contrasena TEXT NOT NULL
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS user_projects (
      userId INTEGER NOT NULL,
      projectId INTEGER NOT NULL,
      PRIMARY KEY (userId, projectId),
      FOREIGN KEY (userId) REFERENCES usuario(id),
      FOREIGN KEY (projectId) REFERENCES projects(id)
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS issues (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      projectId INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'open',
      tags TEXT, -- guardamos JSON de array
      FOREIGN KEY (projectId) REFERENCES projects(id)
    )
  `);

  // Seed mínimo de proyecto demo si no hay ninguno
  if (process.env.NODE_ENV != "test") {
    const projects = await all("SELECT id FROM projects LIMIT 1");
    if (projects.length === 0) {
      await run(
       "INSERT INTO projects (name, description) VALUES (?, ?)",
       ["Demo Project", "Sample project for issues"]
     );  
    }
  }
};
