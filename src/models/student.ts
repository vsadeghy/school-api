import { Document, model, Model, Schema, Types } from "mongoose";
import { ILessonDoc } from "./lesson";

export interface IStudent {
    name: string;
    email: string;
    password: string;
    lessons?: ILessonDoc;
}

const StudentSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    lessons: [{ type: Types.ObjectId, ref: "Lesson" }],
});

export interface IStudentDoc extends IStudent, Document {}
export interface IStudentModel extends Model<IStudentDoc> {}

const Student = model<IStudentDoc, IStudentModel>("Student", StudentSchema);
export default Student;
