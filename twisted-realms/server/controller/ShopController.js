// controller/ShopController.js
import Shop from "../model/Shop.js";

export default class ShopController {
  static async getItems(req, res) {
    try {
      const items = await Shop.getItems();
      res.status(200).json(items);
    } catch (error) {
      console.error("Error getItems :", error);
      res.status(500).json({ status: "error", message: "Erreur Serveur" });
    }
  }
}
