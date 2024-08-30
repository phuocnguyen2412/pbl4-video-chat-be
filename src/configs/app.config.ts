import { Express } from "express";
import cors from "cors";
import corsOptions from "./cors.config";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import routes from "../routes";
const configApp = async (app: Express) => {
    app.use(cors(corsOptions));
    app.options("*", cors(corsOptions));

    app.use(cookieParser());

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // API routes
    app.use("/api/v1", routes);
};
export default configApp;