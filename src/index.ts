import "dotenv-safe/config";
import express, { json, Request, Response } from "express";
import mongoose from "mongoose";
import { studentRouter } from "./routes/student";
import { teacherRouter } from "./routes/teacher";
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
};

main();
