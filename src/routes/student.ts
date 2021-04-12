import { Router } from "express";
import { getStudents } from "../controllers/student";
import { validUser } from "../middlewares/validUser";
import { signup } from "./../controllers/student";

const router = Router();

router.get("/", getStudents);
router.post("/signup", validUser, signup);

export const studentRouter = router;
