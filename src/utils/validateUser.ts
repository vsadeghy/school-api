import { Response } from "express";
import { emailRegex } from "./emailRegex";
import { UserInput } from "./UserInput";

export const validateUser = (user: UserInput, res: Response) => {
    if (user.name.length < 5 || !user.name.includes(" ")) {
        res.status(400).send("enter your full name");
    }
    if (!user.email.match(emailRegex)) {
        res.status(400).send("invalid email");
    }
    if (user.username.length < 5) {
        res.status(400).send("username length must be atleast 5 characters");
    }
    if (user.password.length < 8) {
        res.status(400).send("password length must be at least 8 characters");
    }
};
