import { Router } from "express";
import {
    addStudent,
    createLesson,
    getLesson,
    getLessons,
    getStudents,
    getTeacher,
    removeStudent,
    setTeacher,
} from "../controllers/lesson";

const router = Router();
router.get("/", getLessons);
router.post("/createLesson", createLesson);
router.get("/:id", getLesson);
router.get("/:id/teacher", getTeacher);
router.put("/:id/teacher/:teacherId", setTeacher);
router.get("/:id/students", getStudents);
router.route("/:id/students/:studentId").post(addStudent).delete(removeStudent);

export const lessonRouter = router;
