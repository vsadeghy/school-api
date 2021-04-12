import { Document, model, Model, Schema, Types } from "mongoose";
import { ILessonDoc } from "./lesson";
export interface ITeacher {
    name: string;
    email: string;
    password: string;
    lessons?: ILessonDoc;
}

const TeacherSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    lessons: [{ type: Types.ObjectId, ref: "Lesson" }],
});

export interface ITeacherDoc extends ITeacher, Document {}
export interface ITeacherModel extends Model<ITeacherDoc> {}

const Professor = model<ITeacherDoc, ITeacherModel>("Professor", TeacherSchema);
export default Professor;
