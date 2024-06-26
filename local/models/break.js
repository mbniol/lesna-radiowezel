import Mysql from "../helpers/database.js";

export default class Model {
  static async getMany(pattern_id) {
    const rows = await Mysql.handleRequest(
      `
    SELECT id, name, position, start, end, for_requested
    FROM breaks WHERE pattern_id=?`,
      [pattern_id]
    );
    return rows;
  }
  static async add(name, start, end, for_requested, pattern_id) {
    const rows = await Mysql.handleRequest(
      `
				INSERT INTO breaks (name, start, end, for_requested, pattern_id, position) 
        SELECT ?, ?, ?, ?, ?, COUNT(*) FROM breaks WHERE pattern_id=?`,
      [name, start, end, for_requested, pattern_id, pattern_id]
    );
    return rows;
  }
  static async replace(pattern_id, breaks) {
    await Mysql.handleRequest(
      `
      DELETE FROM breaks WHERE pattern_id=?`,
      [pattern_id]
    );
    breaks.forEach(async ({ name, position, start, end, forRequested }) => {
      await Mysql.handleRequest(
        `
        INSERT INTO breaks (name, start, end, for_requested, pattern_id, position) VALUES
          (?, ?, ?, ?, ?, ?)`,
        [name, start, end, +forRequested, pattern_id, position]
      );
    });
  }
  // static async delete(id, pattern_id) {
  //   const pool = Mysql.getPromiseInstance();
  //   try {
  //     const [row] = await errorHandler(pool.query, pool,`SELECT position FROM breaks WHERE id=?`, [
  //       id,
  //     ]);
  //     const position = row[0].position;
  //     await errorHandler(pool.query, pool,`DELETE FROM breaks WHERE id=?`, [id]);
  //
  //
  //       await errorHandler(pool.query, pool,
  //         `UPDATE breaks SET position=position-1 WHERE pattern_id=? AND position>?`,
  //         [pattern_id, position]
  //       )
  //     );
  //   } catch (e) {
  //     throw e;
  //   }
  // }
}
