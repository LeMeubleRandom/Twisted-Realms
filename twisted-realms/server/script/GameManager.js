import Game from "./scriptModel/Game.js";
import GameModel from "../model/Game.js";

class GameManager {
  constructor() {
    this.games = new Map();
  }

  async startGame(gameId, player1Data, player2Data, lobbyData = {}) {
    if (this.games.has(gameId)) {
      throw new Error("Une partie avec cet ID existe déjà.");
    }

    const newGame = new Game(gameId, player1Data, player2Data, lobbyData);
    this.games.set(gameId, newGame);

    await newGame.start();
    return newGame;
  }

  getGame(gameId) {
    return this.games.get(gameId);
  }

  endGame(gameId) {
    this.games.delete(gameId);
    console.log(`Partie ${gameId} terminée et supprimée de la mémoire.`);
  }

  async handlePlayerAction(gameId, playerId, actionType, payload) {
    const game = this.getGame(gameId);
    if (!game) return { error: "Partie introuvable" };

    if (game.playerTurn !== playerId) {
      return { error: "Ce n'est pas votre tour !" };
    }

    switch (actionType) {
      case "CHANGE_PHASE":
        await game.nextTurnPhase(payload.requestedPhase);
        break;
      default:
        return { error: "Action inconnue" };
    }

    // Sauvegarde en base de données de l'état mis à jour des mains et decks
    const p1Hand = game.players.p1.hand.map(c => c.id);
    const p2Hand = game.players.p2.hand.map(c => c.id);
    const p1DeckOrder = game.players.p1.deck.map(c => c.id);
    const p2DeckOrder = game.players.p2.deck.map(c => c.id);
    await GameModel.updateGameState(gameId, p1Hand, p2Hand, p1DeckOrder, p2DeckOrder);

    return { success: true, gameState: game };
  }
}

export default new GameManager();
