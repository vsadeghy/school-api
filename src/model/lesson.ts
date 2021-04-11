import { Document, model, Model, Schema, Types } from "mongoose";
import { IProfessorDoc } from "./professor";
import { IStudentDoc } from "./student";

export interface ILesson {
    name: string;
    professor?: IProfessorDoc;
    students?: IStudentDoc[];
}

const LessonSchema = new Schema({
    name: { type: String, required: true },
    professor: { type: Types.ObjectId, ref: "Professor" },
    students: [{ type: Types.ObjectId, ref: "Student" }],
});

export interface ILessonDoc extends ILesson, Document {}
export interface ILessonModel extends Model<ILessonDoc> {}

const Lesson = model<ILessonDoc, ILessonModel>("Lesson", LessonSchema);
export default Lesson;
