var Player = require("../models/players");

const { param, body, validationResult } = require("express-validator");

const playerValidationRules = () => {
  return [
    body("firstName")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Name must be specified."),
    body("lastName")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Name must be specified."),
    body("age")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Age must be specified.")
      .isNumeric()
      .withMessage("Age must be a number."),
    body("goalsNumber")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Goals number must be specified.")
      .isNumeric()
      .withMessage("Goals number must be a number."),
    body("birth", "Invalid date of birth")
      .optional({ checkFalsy: true })
      .isISO8601()
      .toDate(),
    body("club")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Club must be specified.")
      .isNumeric()
      .withMessage("Club must be a number."),
  ];
};

const paramIdValidationRule = () => {
  return [
    param("id")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Id must be specified.")
      .isNumeric()
      .withMessage("Id must be a number."),
  ];
};

const bodyIdValidationRule = () => {
  return [
    body("id")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Id must be specified.")
      .isNumeric()
      .withMessage("Id must be a number."),
  ];
};

const checkValidity = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(400).json({
    errors: extractedErrors,
  });
};

exports.create = [
  bodyIdValidationRule(),
  playerValidationRules(),
  checkValidity,
  (req, res, next) => {
    var player = new Player({
      _id: req.body.id,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      age: req.body.age,
      position: req.body.position,
      goalsNumber: req.body.goalsNumber,
      birth: req.body.birth,
      club: req.body.club,
    });

    player.save(function (err) {
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(201).json("Player created successfully !");
    });
  },
];

exports.getAll = (req, res, next) => {
  Player.find()
    .populate("club")
    .exec(function (err, result) {
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(200).json(result);
    });
};

exports.getById = [
  paramIdValidationRule(),
  checkValidity,
  (req, res, next) => {
    Player.findById(req.params.id)
      .populate("club")
      .exec(function (err, result) {
        if (err) {
          return res.status(500).json(err);
        }
        return res.status(200).json(result);
      });
  },
];

exports.update = [
  paramIdValidationRule(),
  playerValidationRules(),
  checkValidity,
  (req, res, next) => {
    var player = new Player({
      _id: req.params.id,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      age: req.body.age,
      position: req.body.position,
      goalsNumber: req.body.goalsNumber,
      birth: req.body.birth,
      club: req.body.club,
    });

    Player.findByIdAndUpdate(req.params.id, player, function (err, result) {
      if (err) {
        return res.status(500).json(err);
      }
      if (!result) {
        res
          .status(404)
          .json("Player with id " + req.params.id + " is not found !");
      }
      return res.status(201).json("Player updated successfully !");
    });
  },
];

exports.delete = [
  paramIdValidationRule(),
  checkValidity,
  (req, res, next) => {
    Player.findByIdAndRemove(req.params.id).exec(function (err, result) {
      if (err) {
        return res.status(500).json(err);
      }
      if (!result) {
        res
          .status(404)
          .json("Player with id " + req.params.id + " is not found !");
      }
      return res.status(200).json("Player deleted successfully !");
    });
  },
];
