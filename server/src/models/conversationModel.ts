import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    members: {
      type: Array
    },
  },
  { timestamps: true }
);

const Conversation = mongoose.model('Conversation', conversationSchema, 'conversation')

export default Conversation;