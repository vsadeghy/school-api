import { Document, model, Model, Schema } from "mongoose";
import { ID } from "../types";
import { removeItem } from "./../utils/removeItem";
import Student, { IStudentDoc } from "./student";
import Teacher, { ITeacherDoc } from "./teacher";

export interface ILesson {
    name: string;
    teacher: ID | ITeacherDoc;
    students: ID[] | IStudentDoc[];
}

export interface StudentLesson {
    lesson: ID | ILessonDoc;
    grade?: number;
}

export interface ILessonDoc extends ILesson, Document {
    hasStudent(studentId: ID): boolean;
    addStudent(studentId: ID): Promise<string>;
    addStudents(studentIds: ID[]): Promise<string>;
    removeStudent(studentId: ID): Promise<string>;
    setTeacher(teacherId: ID): Promise<string>;
}
export interface ILessonModel extends Model<ILessonDoc> {}

const LessonSchema = new Schema({
    name: { type: String, required: true },
    teacher: { type: Schema.Types.ObjectId, ref: "Teacher" },
    students: [{ type: Schema.Types.ObjectId, ref: "Student" }],
});

LessonSchema.method("hasStudent", function (this: any, studentId: ID) {
    return this.students.includes(studentId);
});

LessonSchema.method("addStudent", async function (this: any, studentId: ID) {
    const student = await Student.findById(studentId);
    if (!student) {
        return "student not found";
    }

    if (this.hasStudent(studentId) || student.hasLesson(this._id)) {
        return "student already has this lesson";
    }
    student.lessons.push({ lesson: this._id, grade: 20 });
    this.students.push(studentId);
    await this.save();
    await student.save();
    return "student added to the lesson";
});

LessonSchema.method(
    "addStudents",
    async function (this: any, studentIds: ID[]) {
        for (const studentId in studentIds) {
            const student = await Student.findById(studentId);
            if (!student) continue;
            student.lessons.push({ lesson: this._id });
            this.students.push(studentId);
            await student.save();
        }
        await this.save();
        return true;
    }
);

LessonSchema.method("removeStudent", async function (this: any, studentId: ID) {
    const student = await Student.findById(studentId);
    if (!student) {
        return "student not found";
    }
    const removedLesson = student.getLesson(this.id);
    if (!this.students.includes(studentId) && !removedLesson) {
        return "student doesn't have this lesson";
    }
    this.students = removeItem(this.students, studentId);
    student.lessons = removeItem(student.lessons, removedLesson);
    await this.save();
    await student.save();
    return "removed lesson from student";
});

LessonSchema.method("setTeacher", async function (this: any, teacherId: ID) {
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
        return "no teachers found";
    }
    if (this.teacher == teacherId || teacher.lessons.includes(this._id)) {
        return "the teacher is already this lesson's teacher";
    }
    this.teacher = teacherId;
    teacher.lessons.push(this._id);
    await this.save();
    await teacher!.save();
    return "teacher set for this lesson";
});

const Lesson = model<ILessonDoc, ILessonModel>("Lesson", LessonSchema);
export default Lesson;
