var mongoose = require("mongoose");
const { DateTime } = require("luxon");

const clubSchema = new mongoose.Schema({
  _id: { type: Number, required: true },
  name: { type: String, required: true },
  creationDate: {
    type: Date,
    required: true,
    transform: (x) => DateTime.fromJSDate(x).toISODate(),
  },
  players: [{ type: Number, required: true, ref: "players" }],
});

clubSchema.virtual("id").get(function () {
  return this._id;
});

clubSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

module.exports = mongoose.model("club", clubSchema);
