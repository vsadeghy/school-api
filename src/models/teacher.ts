import { Document, model, Model, Schema } from "mongoose";
import { ID } from "../types";
import { emailRegex } from "../utils/emailRegex";
import { ILessonDoc } from "./lesson";
export interface ITeacher {
    name: string;
    username: string;
    email: string;
    password: string;
    lessons: ID[] | ILessonDoc[];
}

export interface ITeacherDoc extends ITeacher, Document {}
export interface ITeacherModel extends Model<ITeacherDoc> {
    findByEmail(email: string): Promise<ITeacherDoc | null>;
    findByUsername(username: string): Promise<ITeacherDoc | null>;
}

const TeacherSchema = new Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    lessons: [{ type: Schema.Types.ObjectId, ref: "Lesson" }],
});

TeacherSchema.static("findByEmail", (email: string) => {
    return email.match(emailRegex) ? Teacher.findOne({ email }) : null;
});

TeacherSchema.static("findByUsername", (username: string) => {
    return Teacher.findOne({ username });
});

const Teacher = model<ITeacherDoc, ITeacherModel>("Teacher", TeacherSchema);
export default Teacher;
