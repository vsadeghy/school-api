import { Router } from "express";
import { deleteTeacher, getTeachers } from "../controllers/teacher";
import { validUser } from "../middlewares/validUser";
import { createTeacher } from "./../controllers/teacher";

const router = Router();

router.get("/", getTeachers);
router.post("/signup", validUser, createTeacher);
router.delete(":id", deleteTeacher);

export const teacherRouter = router;
