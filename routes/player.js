var express = require("express");
var router = express.Router();
var player_controller = require("../src/controllers/player");

router.post("/", player_controller.create);
router.get("/", player_controller.getAll);
router.get("/:id", player_controller.getById);
router.put("/:id", player_controller.update);
router.delete("/:id", player_controller.delete);

module.exports = router;
