import mongoose, { Document } from 'mongoose';
import { IMovie } from './Movie';

export interface IUser extends Document {
  _id: string;
  created: number;
  nickname: string;
  username: string;
  name: string;
  surname: string;
  phones: string[];
  lastActivity: number;
  language: 'en' | 'uk';
  observableMovies: IMovie[];
  totalMovies: number;
}

export const UserSchema = new mongoose.Schema(
  {
    _id: String,
    created: {
			type: Number,
			default: (): number => new Date().getTime()
		},
    nickname: String,
    username: String,
    name: String,
    surname: String,
    phones: [String],
    observableMovies: [
      {
        type: String,
        ref: 'Movie'
      }
    ],
    lastActivity: {
			type: Number,
			default: (): number => new Date().getTime()
		},
    language: String,
    totalMovies: Number
  },
  { _id: false }
);

// ficha, cool
UserSchema.pre('find', function() {
  this.populate('observableMovies');
}).pre('findOne', function() {
  this.populate('observableMovies');
});

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
