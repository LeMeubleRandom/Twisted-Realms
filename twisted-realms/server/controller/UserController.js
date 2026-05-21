// controller/UserController.js
import User from '../model/User.js';
import UserService from '../service/UserService.js';

class UserController {
    static async login(req, res) {
        try {
            const { email, password } = req.body;

            const sessionData = await UserService.authenticateUser(email, password);

            res.cookie('token_twisted_realms', sessionData.token, {
                httpOnly: true, 
                secure: process.env.NODE_ENV === 'production', // true en production (HTTPS)
                sameSite: 'lax',
                maxAge: 1000000
            });

            res.status(200).json({
                status: "success", 
                message: "Connexion réussie",
                user: sessionData.user
            });

        } catch (error) {
            console.error("Error connexion:", error);
            res.status(401).json({ status: "error", message: error.message });
        }
    }

    static async register(req, res) {
        try {
            const { name, email, password } = req.body;
            const newUser = await UserService.registerUser(name, email, password);

            res.status(201).json({
                status: "success",
                message: `Bienvenue dans Twisted Realms, ${name}`,
                user: newUser
            });
        } catch (error) {
            res.status(400).json({ status: "error", message: error.message });
        }
    }

    static async logout(req, res) {
        res.clearCookie('token_twisted_realms');
        res.status(200).json({ status: "success", message: "Déconnexion réussie" });
    }

    static async getMe(req, res) {
        try {
            const user = await UserService.getUserProfile(req.userId);
            res.status(200).json({ status: "success", user });
        } catch (error) {
            res.status(404).json({ status: "error", message: error.message });
        }
    }

    static async getUserById(req, res) {
        try {
            const userId = req.params.userId;
            const user = await User.findById(userId);
            
            if (!user) {
                throw new Error("Joueur introuvable.");
            }

            delete user.password;
            res.status(200).json(user);
        } catch (error) {
            console.error("Error getUserById", error);
            res.status(500).json({ status: "error", message: "erreur serveur" });
        }
    }
}

export default UserController;