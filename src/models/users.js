
import db from "./db.js";

// Register a new user with the standard user role
export async function registerUser(name, email, passwordHash) {
  const sql = `
    INSERT INTO users (name, email, password_hash, role_id)
    VALUES (
      $1,
      $2,
      $3,
      (SELECT role_id FROM roles WHERE role_name = 'user')
    )
    RETURNING user_id, name, email
  `;

  const result = await db.query(sql, [name, email, passwordHash]);
  return result.rows[0];
}

// Find a user by email, including their role
export async function findUserByEmail(email) {
  const sql = `
    SELECT
      u.user_id,
      u.name,
      u.email,
      u.password_hash,
      r.role_name
    FROM users u
    JOIN roles r ON u.role_id = r.role_id
    WHERE u.email = $1
  `;

  const result = await db.query(sql, [email]);
  return result.rows[0] || null;
}

// Get all registered users and their roles
export async function getAllUsers() {
  const sql = `
    SELECT
      u.user_id,
      u.name,
      u.email,
      r.role_name
    FROM users u
    JOIN roles r ON u.role_id = r.role_id
    ORDER BY u.name
  `;

  const result = await db.query(sql);
  return result.rows;
}
