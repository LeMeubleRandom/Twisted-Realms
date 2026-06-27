import GameManager from "../script/GameManager.js";
import crypto from "crypto";

import User from "../model/User.js";
import Game from "../model/Game.js";
import GameService from "../service/GameService.js";

export default class GameController {
  static async host(req, res) {
    try {
      const gameId = Math.floor(100000 + Math.random() * 900000);
      const { userId, activeDeck } = req.body;

      if (activeDeck === undefined || activeDeck === null) {
        return res.status(400).json({
          status: "error",
          message:
            "Vous devez sélectionner un deck actif dans l'onglet 'Mes Decks' avant de pouvoir créer une partie.",
        });
      }

      const hostedGame = await Game.createGame(gameId, userId, activeDeck);
      await User.setGameId(userId, gameId);
      await User.setInGame(userId, true);
      //GameManager.startGame(gameId);

      res.status(200).json(hostedGame);
    } catch (error) {
      console.error("Error creatingGame:", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  }

  static async join(req, res) {
    try {
      const { userId, activeDeck, gameId } = req.body;

      if (activeDeck === undefined || activeDeck === null) {
        return res.status(400).json({
          status: "error",
          message:
            "Vous devez sélectionner un deck actif dans l'onglet 'Mes Decks' avant de pouvoir rejoindre une partie.",
        });
      }

      const checkPlayer = await GameService.checkPlayer(userId, gameId);
      if (!checkPlayer)
        return res.status(400).json({
          status: "error",
          message: "Utilisateur déjà présent dans la session",
        });

      const joinedGame = await Game.joinGame(gameId, userId, activeDeck);
      await User.setGameId(userId, gameId);
      await User.setInGame(userId, true);

      res.status(200).json(joinedGame);
    } catch (error) {
      console.error("Error joiningGame:", error);
      res
        .status(500)
        .json({ status: "error", message: error.message, stack: error.stack });
    }
  }

  static async getAllLobby(req, res) {
    try {
      const lobbys = await Game.getAllLobby();
      res.status(200).json(lobbys);
    } catch (error) {
      console.error("Error getLobbys  :", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  }

  static async getLobby(req, res) {
    try {
      const gameId = req.params.gameId;
      const lobby = await Game.findById(gameId);
      res.status(200).json(lobby);
    } catch (error) {
      console.error("Error getLobby  :", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  }

  static async startGame(req, res) {
    try {
      const { gameId } = req.body;
      await Game.startGame(gameId);
      res.status(200).json({ status: "success", message: "Partie lancée !" });
    } catch (error) {
      console.error("Error startGame:", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  }

  static async leaveGame(req, res) {
    try {
      const { userId, gameId } = req.body;

      await User.setGameId(userId, null);
      await User.setInGame(userId, false);

      const gameDetails = await Game.findById(gameId);
      if (gameDetails) {
        if (Number(gameDetails.player1Id) === Number(userId)) {
          await Game.deleteGame(gameId);
        } else {
          await Game.removePlayer2(gameId);
        }
      }

      res.status(200).json({ status: "success", message: "Salon quitté." });
    } catch (error) {
      console.error("Error leaveGame:", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  }

  static async getGameStart(req, res) {
    try {
      res
        .status(200)
        .json({ status: "success", message: "Partie initialisée" });
    } catch (error) {
      console.error("Error getGameStart:", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  }
}
