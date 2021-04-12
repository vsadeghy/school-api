import { Document, model, Model, Schema, Types } from "mongoose";
import { IStudentDoc } from "./student";
import { ITeacherDoc } from "./teacher";

export interface ILesson {
    name: string;
    teacher?: ITeacherDoc;
    students?: IStudentDoc[];
}

const LessonSchema = new Schema({
    name: { type: String, required: true },
    teacher: { type: Types.ObjectId, ref: "Teacher" },
    students: [{ type: Types.ObjectId, ref: "Student" }],
});

export interface ILessonDoc extends ILesson, Document {}
export interface ILessonModel extends Model<ILessonDoc> {}

const Lesson = model<ILessonDoc, ILessonModel>("Lesson", LessonSchema);
export default Lesson;
