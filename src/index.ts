import "dotenv-safe/config";
import express from "express";

const main = async () => {
    const app = express();

    const PORT = parseInt(process.env.PORT);
    app.listen(PORT, () => {
        console.log(`server started on localhost:${PORT}`);
    });
};

main();
