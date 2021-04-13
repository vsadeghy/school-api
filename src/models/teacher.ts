import { Document, model, Model, Schema } from "mongoose";
import { ID } from "./../types";
import { ILessonDoc } from "./lesson";
export interface ITeacher {
    name: string;
    email: string;
    password: string;
    lessons?: ID[] | ILessonDoc[];
}

const TeacherSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    lessons: [{ type: Schema.Types.ObjectId, ref: "Lesson" }],
});

export interface ITeacherDoc extends ITeacher, Document {}
export interface ITeacherModel extends Model<ITeacherDoc> {}

const Professor = model<ITeacherDoc, ITeacherModel>("Professor", TeacherSchema);
export default Professor;
