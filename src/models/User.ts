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
  group: string;
  lastActivity: number;
  language: 'en' | 'uk';

  observableMovies: IMovie[];
  totalMovies: number;
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

    observableMovies: [
      {
        type: String,
        ref: 'Movie'
      }
    ],
    
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
