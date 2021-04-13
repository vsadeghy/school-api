import "dotenv-safe/config";
import express, { json, Request, Response } from "express";
import mongoose from "mongoose";
import { lessonRouter, studentRouter, teacherRouter } from "./routes";
import { StatusError } from "./utils/StatusError";

const main = async () => {
    await mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: true,
    });
    mongoose.connection.on("error", (err) => {
        console.error(err);
    });

    const app = express();
    app.use(json());

    app.use("/students", studentRouter);
    app.use("/teachers", teacherRouter);
    app.use("/lessons", lessonRouter);

    app.use((error: StatusError, _req: Request, res: Response) => {
        console.log(error);
        const status = error.statusCode || 500;
        const message = error.message;
        res.status(status).json({ message: message });
    });

    const PORT = parseInt(process.env.PORT);
    app.listen(PORT, () => {
        console.log(`server started on localhost:${PORT}`);
    });

    // const student = await Student.findById("607610f78941a6104074e2cd");
    // const removedLesson = student.getLesson("6075ef77f692a422a81a57f1");
    // const removed = removeItem(student.lessons, removedLesson);
    // console.log("removed: ", removed);
    // student.lessons = removed;
    // await student.save();
};

main();
