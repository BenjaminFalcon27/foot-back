var Club = require("../models/clubs");
const { param, body, validationResult } = require("express-validator");

const clubValidationRules = () => {
  return [
    body("name")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Name must be specified."),

    body("creationDate", "Invalid date of creation")
      .optional({ checkFalsy: true })
      .isISO8601()
      .toDate(),
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
  clubValidationRules(),
  checkValidity,
  (req, res, next) => {
    var club = new Club({
      _id: req.body.id,
      name: req.body.name,
      creationDate: req.body.creationDate,
      players: req.body.players,
    });

    club.save(function (err) {
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(201).json("Club created successfully !");
    });
  },
];

exports.getAll = (req, res, next) => {
  Club.find()
    .populate("players")
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
    Club.findById(req.params.id)
      .populate("players")
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
  clubValidationRules(),
  checkValidity,
  (req, res, next) => {
    var club = new Club({
      _id: req.body.id,
      name: req.body.name,
      creationDate: req.body.creationDate,
      players: req.body.players,
    });

    Club.findByIdAndUpdate(req.params.id, club, function (err, result) {
      if (err) {
        return res.status(500).json(err);
      }
      if (!result) {
        res
          .status(404)
          .json("Club with id " + req.params.id + " is not found !");
      }
      return res.status(201).json("Club updated successfully !");
    });
  },
];

exports.delete = [
  paramIdValidationRule(),
  checkValidity,
  (req, res, next) => {
    Club.findByIdAndRemove(req.params.id).exec(function (err, result) {
      if (err) {
        return res.status(500).json(err);
      }
      if (!result) {
        res
          .status(404)
          .json("Club with id " + req.params.id + " is not found !");
      }
      return res.status(200).json("Club deleted successfully !");
    });
  },
];
