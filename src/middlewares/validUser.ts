import { NextFunction, Request, Response } from "express";
import { StatusError } from "../utils/StatusError";
import { UserInput } from "../utils/UserInput";
const emailRegex = /^\S+@\S+\.\S+$/;

export const validUser = (req: Request, _res: Response, next: NextFunction) => {
    const user: UserInput = req.body;
    if (user.name.length < 5 || !user.name.includes(" ")) {
        const error = new StatusError("enter your full name");
        error.statusCode = 400;
        throw error;
    }
    if (!user.email.match(emailRegex)) {
        const error = new StatusError("invalid email");
        error.statusCode = 400;
        throw error;
    }
    if (user.username.length < 5) {
        const error = new StatusError(
            "username length must be atleast 5 characters"
        );
        error.statusCode = 400;
        throw error;
    }
    if (user.password.length < 8) {
        const error = new StatusError(
            "password length must be at least 8 characters"
        );
        error.statusCode = 400;
        throw error;
    }
    next();
};
