import { Router } from "express";
import {
    createTeacher,
    deleteTeacher,
    getTeachers,
    setStudentGrade,
} from "../controllers/teacher";

const router = Router();

router.get("/", getTeachers);
router.post("/signup", createTeacher);
router.delete("/:id", deleteTeacher);
router.put("/:id/lessons/:lessonId/setStudentGrade", setStudentGrade);

export const teacherRouter = router;
