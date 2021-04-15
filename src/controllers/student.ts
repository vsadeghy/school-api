import argon2 from "argon2";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import Student from "../models/student";
import { UserInput } from "../utils/UserInput";
import { validateUser } from "../utils/validateUser";

export const getStudents = async (_req: Request, res: Response) => {
    const students = await Student.find();
    if (!students.length) {
        res.send("no students found");
        return;
    }
    // for (const student of students) {
    //     await student.populate("lessons").execPopulate();
    // }
    res.send(JSON.stringify(students, null, 2));
};

export const createStudent = async (req: Request, res: Response) => {
    const body: UserInput = req.body;
    validateUser(body, res);
    const existingStudentWithMail = await Student.findByEmail(body.email);
    const existingStudentWithUsername = await Student.findByUsername(
        body.username
    );
    if (existingStudentWithUsername || existingStudentWithMail) {
        res.status(400).send(
            "a student with the same username or mail already exists"
        );
    }
    const hashedPassword = await argon2.hash(body.password);
    console.log("creating student");
    const student = await Student.create({
        name: body.name,
        email: body.email,
        username: body.username,
        password: hashedPassword,
    });
    console.log("student created: ", student);
    const studentId = student._id.toString();
    const token = jwt.sign(
        {
            email: student.email,
            studentId,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
    res.json({ token, studentId });
};

export const deleteStudent = async (req: Request, res: Response) => {
    const { id } = req.params;
    await Student.findByIdAndDelete(id);
    res.send("student deleted");
};
