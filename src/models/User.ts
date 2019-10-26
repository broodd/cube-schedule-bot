import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  created: number;
  nickname: string;
  username: string;
  name: string;
  surname: string;
  fullName: string;
  phones: string[];
  group: string;
  lastActivity: number;
  language: 'en' | 'uk';
}

export const UserSchema = new mongoose.Schema(
  {
    _id: String,
    created: {
			type: Date,
			default: Date.now
		},
    nickname: String,
    username: String,
    name: String,
    surname: String,
    phones: [String],
    group: String,
    language: String,
    lastActivity: {
      type: Date,
      default: Date.now
    },
  },
  {
    _id: false,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  }
);

UserSchema.virtual('fullName').get(function () {
  return [this.surname, this.name].join(' ');
});

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
