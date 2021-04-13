import { Document, model, Model, Schema } from "mongoose";
import { ID } from "./../types";
import { IStudentDoc } from "./student";
import { ITeacherDoc } from "./teacher";

export interface ILesson {
    name: string;
    teacher?: ITeacherDoc;
    students?: ID[] | IStudentDoc[];
}

export interface StudentLesson {
    lesson: ID | ILessonDoc;
    grade: number;
}

const LessonSchema = new Schema({
    name: { type: String, required: true },
    teacher: { type: Schema.Types.ObjectId, ref: "Teacher" },
    students: [{ type: Schema.Types.ObjectId, ref: "Student" }],
});

export interface ILessonDoc extends ILesson, Document {}
export interface ILessonModel extends Model<ILessonDoc> {}

const Lesson = model<ILessonDoc, ILessonModel>("Lesson", LessonSchema);
export default Lesson;
