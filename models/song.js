import Mysql from "../helpers/database.js";

export default class Model {
  static async get_song(id) {
    const pool = Mysql.getPromiseInstance();
    return await pool.query(
      "SELECT id, name, cover, artist, length, banned FROM tracks where id=?",
      id
    );
  }

  static async ban_song(id) {
    const pool = Mysql.getPromiseInstance();
    pool.query(
        "UPDATE tracks SET banned = 1, verified = 1 WHERE id =?",
        id
    );
    pool.query(
        "DELETE FROM votes where track_id = ?",
        id
    );
  }
  static async unban_song(id) {
    const pool = Mysql.getPromiseInstance();
    pool.query(
        "UPDATE tracks SET banned = 0, verified = 1 WHERE id =?",
        id
    );
  }

  static async verify_song(id) {
    const pool = Mysql.getPromiseInstance();
    return pool.query(
        "UPDATE tracks SET verified = 1 WHERE id =?",
        id
    );
  }
  static async get_track_ranking(one = 0, two = 1) {
    const pool = Mysql.getPromiseInstance();
    const result = await pool.query(
      `
        SELECT t.id, t.cover, t.name, t.artist, t.length,
               SUM(CASE WHEN DATE(v.date_added) = DATE_SUB(CURDATE(), INTERVAL ? DAY) THEN 1 ELSE 0 END) +
               ROUND(SUM(CASE WHEN DATE(v.date_added) = DATE_SUB(CURDATE(), INTERVAL ? DAY) THEN 1 ELSE 0 END) / 2) AS count
        FROM tracks t
        JOIN votes v ON t.id = v.track_id
        GROUP BY t.name
        HAVING count > 0
        ORDER BY count DESC
        LIMIT 99;`,
      [one, two]
    );
    return result[0];
  }

  static async getSongs(banned=0, verified=0) {
    const pool = Mysql.getPromiseInstance();
    const [rows] = await pool.query(
      "SELECT id, name, cover, artist, length, banned FROM tracks where banned = ? and verified = ?",[banned,verified]
    );
    return rows;
  }

  static async changeSongStatus(id, status) {
    const pool = Mysql.getPromiseInstance();
    await pool.query("UPDATE tracks SET banned=? WHERE id=?", [status, id]);
    await pool.query("DELETE FROM votes WHERE track_id=?", [status, id]);
    return true;
  }
  static async add_track(id, cover, artist, length, name,ban=0,verified=0) {
    const pool = Mysql.getPromiseInstance();
    pool.query(
      `
            INSERT INTO tracks (id, cover, artist , length, name, banned,verified) VALUES (?, ?, ?, ?, ?, ?,?)
            `,
      [id, cover, artist, length, name, ban,verified]
    );
  }
  static async add_vote(id) {
    const pool = Mysql.getPromiseInstance();
    pool.query(
      "INSERT INTO votes (id, track_id, date_added) VALUES (NULL, ?, current_timestamp())",
      [id]
    );
  }
}
