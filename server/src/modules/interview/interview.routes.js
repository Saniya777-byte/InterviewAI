const express = require("express");
const {start,message,end, getById, getHistory} = require("./interview.controller");

const authMiddleware = require("../../middleware/auth.middleware");

const router = express.Router();

router.post("/start", authMiddleware, start);

router.post("/message", authMiddleware, message);

router.post("/end", authMiddleware, end);

router.get("/history", authMiddleware, getHistory);

router.get("/:id", authMiddleware, getById);

module.exports = router;