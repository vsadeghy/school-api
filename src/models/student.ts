import { Document, model, Model, Schema, Types } from "mongoose";
import { StudentLesson } from "./lesson";

export interface IStudent {
    name: string;
    username: string;
    email: string;
    password: string;
    lessons: StudentLesson[];
}

export interface IStudentDoc extends IStudent, Document {}
export interface IStudentModel extends Model<IStudentDoc> {}

const StudentSchema = new Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    lessons: [
        {
            lessonId: { type: Types.ObjectId, ref: "Lesson" },
            grade: { type: Number, min: 0, max: 20 },
        },
    ],
});

const Student = model<IStudentDoc, IStudentModel>("Student", StudentSchema);
export default Student;
