const Database = require('better-sqlite3');

class DatabaseManager {
  constructor() {
    this.db = new Database('Auth.db');
    this.initializeDatabase();
  }

  initializeDatabase() {
    try {
      this.db.pragma('journal_mode = WAL');
      
      // Tokens table
      this.db.prepare(`
        CREATE TABLE IF NOT EXISTS Tokens (
          id INTEGER PRIMARY KEY,
          slug TEXT,
          accessToken TEXT NOT NULL,
          refreshToken TEXT NOT NULL,
          expires INTEGER,
          createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
          scope TEXT,
          type TEXT,
          updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
        )`).run();

      console.log('Database initialized successfully');
    } catch (err) {
      console.error('Database initialization failed:', err);
      process.exit(1);
    }
  }

  // Token methods
  saveToken(id, slug, accessToken, refreshToken, expires, scope, type) {
    const stmt = this.db.prepare(`
      INSERT INTO Tokens (id, slug, accessToken, refreshToken, expires, scope, type, createdAt, updatedAt) 
      VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT(id) DO UPDATE SET
        slug = excluded.slug,
        accessToken = excluded.accessToken,
        refreshToken = excluded.refreshToken,
        expires = excluded.expires,
        scope = excluded.scope,
        type = excluded.type,
        updatedAt = CURRENT_TIMESTAMP
    `);
    return stmt.run(id, slug, accessToken, refreshToken, expires, scope, type);
  }

  getToken(id) {
    return this.db.prepare('SELECT * FROM Tokens WHERE id = ?').get(id);
  }
}

module.exports = new DatabaseManager();
