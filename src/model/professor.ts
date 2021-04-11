import { Document, model, Model, Schema, Types } from "mongoose";
import { ILessonDoc } from "./lesson";
export interface IProfessor {
    name: string;
    lessons?: ILessonDoc;
}

const ProfessorSchema = new Schema({
    name: { type: String, required: true },
    lessons: [{ type: Types.ObjectId, ref: "Lesson" }],
});

export interface IProfessorDoc extends IProfessor, Document {}
export interface IProfessorModel extends Model<IProfessorDoc> {}

const Professor = model<IProfessorDoc, IProfessorModel>(
    "Professor",
    ProfessorSchema
);
export default Professor;
