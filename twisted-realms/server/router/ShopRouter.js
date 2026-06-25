import express from "express";
import ShopController from "../controller/ShopController.js";

const router = express.Router();

router.get("/items", ShopController.getItems);

export default router;
