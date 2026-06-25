// model/Shop.js
import pool from "../db/mysql.js";

export default class Shop {
  static async getItems() {
    const [[decks], [packs]] = await Promise.all([
      pool.execute("SELECT * FROM structureDeck"),
      pool.execute("SELECT * FROM cardPack"),
    ]);

    return {
      decks,
      packs,
    };
  }
}
