const mongoose = require('mongoose');

let taskSchema = new mongoose.Schema({
  name: {
        type: String,
        required: true
      },
  lpLink: {
        type: String,
        required: false
      },
  opLink: {
        type: String,
        required: false
      },
  qa: {
        type: Date,
        default: Date.now,
        required: false
      },
  proof: {
        type: Date,
        default: Date.now,
        required: false
      },
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String
  },
  comments: [
   {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
   }
      ]
});

module.exports = mongoose.model('Task', taskSchema);
