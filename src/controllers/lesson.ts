import { Request, Response } from "express";
import Lesson, { ILesson } from "../models/lesson";
import Student from "../models/student";
import Teacher from "../models/teacher";
import { ID, Select } from "../types";
import { ILessonDoc } from "./../models/lesson";

export const getLessons = async (_req: Request, res: Response) => {
    const lessons = await Lesson.find();
    if (!lessons.length) {
        res.status(404).send("no lessons found");
        return;
    }
    res.json(lessons);
};

export const createLesson = async (req: Request, res: Response) => {
    const body: ILesson = req.body;
    console.log("body:", body);
    if (!body.name) {
        res.status(400).send("enter a name for the lesson");
        return;
    }
    const lesson = await Lesson.create({ name: body.name });
    if (body.teacher) {
        const teacher = await Teacher.findById(body.teacher);
        if (teacher) {
            lesson.teacher = body.teacher;
            await lesson.save();
            teacher.lessons?.push(lesson._id);
            await teacher.save();
        }
    }

    if (body?.students?.length) {
        for (const studentId of body.students) {
            const student = await Student.findById(studentId);
            if (student) {
                lesson.students?.push(student.id);
                await lesson.save();
                student.lessons.push({ lesson: lesson.id });
            }
        }
    }

    res.json(lesson);
};

export const getLesson = async (req: Request, res: Response) => {
    const lesson = await Lesson.findById(req.params.id).select("-__id -__v");
    if (!lesson) {
        res.status(404).send("lesson not found");
        return;
    }
    await lesson
        .populate("teacher", "-_id -password -__v -lessons")
        .populate("students", "-_id -password -__v -lessons")
        .execPopulate();
    res.json(lesson);
};

export const getTeacher = async (req: Request, res: Response) => {
    const lesson = await Lesson.findById(req.params.id)
        .select("name teacher -_id")
        .populate("teacher", "-_id -password -__v");
    if (!lesson) {
        res.status(404).send("lesson not found");
        return;
    }
    if (!lesson!.teacher) {
        res.send("this lesson doesn't have a teacher");
    }
    res.json(lesson!.teacher);
};

export const setTeacher = async (req: Request, res: Response) => {
    const { id, teacherId } = req.params;
    const lesson = await Lesson.findById(id);
    if (!lesson) {
        res.status(404).send("lesson not found");
        return;
    }
    const result = await lesson.setTeacher((teacherId as unknown) as ID);
    res.send(result);
};

export const getStudents = async (req: Request, res: Response) => {
    const lesson = (await Lesson.findById(req.params.id).select(
        "name students"
    )) as Select<ILessonDoc, "name" | "students">;
    if (!lesson) {
        res.status(404).send("lesson not found");
        return;
    }
    await lesson
        .populate("students", "-__v -password -lesson.lesson")
        .execPopulate();
    res.json(lesson);
    return;
};

export const removeStudent = async (req: Request, res: Response) => {
    const { id, studentId } = req.params;
    const lesson = await Lesson.findById(id);
    if (!lesson) {
        res.status(404).send("lesson no found");
        return;
    }
    const result = await lesson.removeStudent((studentId as unknown) as ID);
    res.send(result);
};

export const addStudent = async (req: Request, res: Response) => {
    const { id, studentId } = req.params;
    const lesson = await Lesson.findById(id);
    if (!lesson) {
        res.status(404).send("lesson no found");
        return;
    }
    const result = await lesson.addStudent((studentId as unknown) as ID);
    res.send(result);
};
