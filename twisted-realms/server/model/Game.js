// model/Game.js
import pool from "../db/mysql.js";

export default class Game {
  static async createGame(gameId, userId, activeDeck) {
    const [game] = await pool.execute(
      "INSERT INTO game (gameId, player1Id, player1DeckId, createDate, adminId) VALUES (?, ?, ?, UTC_TIMESTAMP(), ?)",
      [gameId, userId, activeDeck, userId],
    );
    return game;
  }

  static async joinGame() {}

  static async getLobbys() {
    const [lobbys] = await pool.execute(`
      SELECT g.*, u.name AS player1Name
      FROM game g
      LEFT JOIN user u ON g.player1Id = u.id
      ORDER BY g.createDate ASC
    `);
    return lobbys;
  }
}
