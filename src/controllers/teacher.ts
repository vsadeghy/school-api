import argon2 from "argon2";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import Teacher from "../models/teacher";
import { UserInput } from "../utils/UserInput";

export const getTeachers = async (_req: Request, res: Response) => {
    const teachers = await Teacher.find();
    if (!teachers.length) {
        res.send("no teachers found");
        return;
    }
    res.send(JSON.stringify(teachers, null, 2));
};

export const createTeacher = async (req: Request, res: Response) => {
    console.log("checking for existing teacher");
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
    console.log("creating teacher");
    const teacher = await Teacher.create({
        name: body.name,
        email: body.email,
        username: body.username,
        password: hashedPassword,
    });
    console.log("teacher created: ", teacher);
    const teacherId = teacher._id.toString();
    const token = jwt.sign(
        {
            email: teacher.email,
            teacherId,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
    res.json({ token, teacherId });
};

export const deleteTeacher = async (req: Request, res: Response) => {
    const { id } = req.params;
    await Teacher.findByIdAndDelete(id);
    res.send("teacher deleted");
};
