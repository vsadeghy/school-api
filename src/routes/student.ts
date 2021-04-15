import { Router } from "express";
import {
    createStudent,
    deleteStudent,
    getStudents,
} from "../controllers/student";

const router = Router();

router.get("/", getStudents);
router.post("/signup", createStudent);
router.delete(":id", deleteStudent);

export const studentRouter = router;
