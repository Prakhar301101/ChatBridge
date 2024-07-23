const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const messageSchema = new Schema(
  {
    sender: { type: mongoose.Schema.ObjectId, ref: 'User' },
    recipient: { type: mongoose.Schema.ObjectId, ref: 'User' },
    text: { type: String },
  },
  { timestamps: true }
);

const messageModel= model('message',messageSchema);

module.exports=messageModel;