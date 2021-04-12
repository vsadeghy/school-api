import { Router } from "express";
import { deleteStudent, getStudents } from "../controllers/student";
import { validUser } from "../middlewares/validUser";
import { createStudent } from "./../controllers/student";

const router = Router();

router.get("/", getStudents);
router.post("/signup", validUser, createStudent);
router.delete(":id", deleteStudent);

export const studentRouter = router;
