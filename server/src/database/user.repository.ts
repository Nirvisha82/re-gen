import db from '../database/sqlite';
import { User } from '../database/user.entity';

export class UserRepository {
  saveOrUpdate(user: User) {
    const stmt = db.prepare(`
      INSERT INTO users (
        email, access_token, refresh_token, token_type,
        scope, refresh_token_expires_in, expiry_date, history_id
      )
      VALUES (
        @email, @access_token, @refresh_token, @token_type,
        @scope, @refresh_token_expires_in, @expiry_date, @history_id
      )
      ON CONFLICT(email) DO UPDATE SET
        access_token = excluded.access_token,
        refresh_token = excluded.refresh_token,
        token_type = excluded.token_type,
        scope = excluded.scope,
        refresh_token_expires_in = excluded.refresh_token_expires_in,
        expiry_date = excluded.expiry_date,
        history_id = excluded.history_id,
        updated_at = CURRENT_TIMESTAMP
    `);
    stmt.run(user);
  }

  findByEmail(email: string): User | undefined {
    return db.prepare(`SELECT * FROM users WHERE email = ?`).get(email);
  }

  updateHistoryId(email: string, history_id: string) {
    db.prepare(`UPDATE users SET history_id = ?, updated_at = CURRENT_TIMESTAMP WHERE email = ?`)
      .run(history_id, email);
  }

  getAllUsers(): User[] {
    return db.prepare(`SELECT * FROM users`).all();
  }
}
