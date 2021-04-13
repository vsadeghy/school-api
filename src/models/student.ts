import { Document, model, Model, Schema, Types } from "mongoose";
import { emailRegex } from "./../utils/emailRegex";
import { StudentLesson } from "./lesson";

export interface IStudent {
    name: string;
    username: string;
    email: string;
    password: string;
    lessons: StudentLesson[];
}

export interface IStudentDoc extends IStudent, Document {}
export interface IStudentModel extends Model<IStudentDoc> {
    findByEmail(email: string): Promise<IStudentDoc | null>;
    findByUsername(username: string): Promise<IStudentDoc | null>;
}

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

StudentSchema.static("findByEmail", (email: string) => {
    return email.match(emailRegex) ? Student.findOne({ email }) : null;
});

StudentSchema.static("findByUsername", (username: string) => {
    return Student.findOne({ username });
});

const Student = model<IStudentDoc, IStudentModel>("Student", StudentSchema);
export default Student;
