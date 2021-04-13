import { Document, model, Model, Schema } from "mongoose";
import { ID } from "./../types";
import { ILessonDoc } from "./lesson";
export interface ITeacher {
    name: string;
    username: string;
    email: string;
    password: string;
    lessons?: ID[] | ILessonDoc[];
}

export interface ITeacherDoc extends ITeacher, Document {}
export interface ITeacherModel extends Model<ITeacherDoc> {}

const TeacherSchema = new Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    lessons: [{ type: Schema.Types.ObjectId, ref: "Lesson" }],
});

const Professor = model<ITeacherDoc, ITeacherModel>("Professor", TeacherSchema);
export default Professor;
