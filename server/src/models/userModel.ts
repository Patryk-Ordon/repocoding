import mongoose from 'mongoose';

let userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
    },
    friendList: {
      type: Array,
      default: []
    }
  },
  { collection: 'users' }
)

const User = mongoose.model('User', userSchema, 'user')

export default User