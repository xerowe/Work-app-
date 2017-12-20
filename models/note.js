const mongoose = require("mongoose");

let noteSchema = mongoose.Schema({
    createdAt: { type: Date, default: Date.now },
    title: String,
    text: String
});

module.exports = mongoose.model("Note", noteSchema);
