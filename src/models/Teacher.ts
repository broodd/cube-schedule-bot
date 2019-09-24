import mongoose, { Document } from 'mongoose';

export interface ITeacher extends Document {
  _id: string;
  created: number;
  name: string;
  surname: string;
  fathername: string;
  fullName: string;
  lessons: [string];
  phones: [string];
  lastActivity: number;
}

export const TeacherSchema = new mongoose.Schema(
  {
    created: Number,
    name: String,
    surname: String,
    fathername: String,
    lessons: [String],
    phones: [String],
    lastActivity: Number
  },
  { 
    id: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  }
);

// TeacherSchema.index({ name: 'text', surname: 'text', fathername: 'text' })

TeacherSchema.virtual('fullName').get(function () {
  return [this.surname, this.name, this.fathername].join(' ');
});

const Teacher = mongoose.model<ITeacher>('Teacher', TeacherSchema);
export default Teacher;
