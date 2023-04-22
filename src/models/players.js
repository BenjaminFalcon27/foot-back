var mongoose = require("mongoose");
const { DateTime } = require("luxon");

const playerSchema = new mongoose.Schema({
  _id: { type: Number, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  age: { type: Number, required: true },
  position: { type: String, required: true },
  goalsNumber: { type: Number, required: true },
  birth: {
    type: Date,
    required: true,
    transform: (x) => DateTime.fromJSDate(x).toISODate(),
  },
  club: { type: Number, required: true, ref: "club" },
});

playerSchema.virtual("id").get(function () {
  return this._id;
});

playerSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

module.exports = mongoose.model("players", playerSchema);
