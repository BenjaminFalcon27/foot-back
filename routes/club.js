var express = require("express");
var router = express.Router();
var club_controller = require("../src/controllers/club");

router.post("/", club_controller.create);
router.get("/", club_controller.getAll);
router.get("/:id", club_controller.getById);
router.put("/:id", club_controller.update);
router.delete("/:id", club_controller.delete);

module.exports = router;
