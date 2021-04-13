import argon2 from "argon2";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import Lesson from "../models/lesson";
import Student from "../models/student";
import Teacher from "../models/teacher";
import { ID } from "../types";
import { UserInput } from "../utils/UserInput";

export const getTeachers = async (_req: Request, res: Response) => {
    const teachers = await Teacher.find()
        .populate("lessons", "-teacher -__v")
        .select("-__v -password");
    if (!teachers.length) {
        res.send("no teachers found");
        return;
    }
    res.send(JSON.stringify(teachers, null, 2));
};

export const createTeacher = async (req: Request, res: Response) => {
    const body: UserInput = req.body;
    const existingTeacherWithMail = await Teacher.findByEmail(body.email);
    const existingTeacherWithUsername = await Teacher.findByUsername(
        body.username
    );
    if (existingTeacherWithUsername || existingTeacherWithMail) {
        res.status(400).send(
            "a teacher with the same username or mail already exists"
        );
    }
    const hashedPassword = await argon2.hash(body.password);
    const teacher = await Teacher.create({
        name: body.name,
        email: body.email,
        username: body.username,
        password: hashedPassword,
    });
    const teacherId = teacher._id.toString();
    const token = jwt.sign(
        {
            email: teacher.email,
            teacherId,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
    res.json({ token, teacher });
};

export const deleteTeacher = async (req: Request, res: Response) => {
    const { id } = req.params;
    await Teacher.findByIdAndDelete(id);
    res.send("teacher deleted");
};

export const setStudentGrade = async (req: Request, res: Response) => {
    const lessonId = (req.params.lessonId as unknown) as ID;
    const id = (req.params.id as unknown) as ID;
    const grade = req.body.grade as number;
    const studentId = req.body.studentId as ID;
    if (!grade) {
        res.status(400).send("send a grade");
        return;
    }
    if (grade > 20 || grade < 0) {
        res.status(400).send("grade should be between 0 and 20");
        return;
    }

    if (!studentId) {
        res.status(400).send("send id of the student");
        return;
    }

    const teacher = await Teacher.findById(id);
    if (!teacher) {
        res.status(404).send("teacher not found");
        return;
    }

    if (!(teacher.lessons as ID[]).includes(lessonId)) {
        res.send("only the lesson's teacher can set grades");
        return;
    }

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
        res.status(404).send("lesson not found");
        return;
    }
    if (!(lesson.students as ID[]).includes(studentId)) {
        res.status(404).send("teacher does not have this student");
        return;
    }
    const student = await Student.findById(studentId);
    if (!student) {
        res.status(404).send("student not found");
        return;
    }
    student.getLesson(lessonId).grade = grade;
    await student.save();
    res.send("student grade set");
};
