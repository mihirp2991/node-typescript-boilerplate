import { Router } from "express";
import UserRoutes from "./user/User.routes";
import { encodeDecodeMiddleware } from "../../middleware";
import EncodeDecodeRouter from "./encodeDecode/EncodeDecod.routes";
const routes = Router();

routes.use("/encode-decode", EncodeDecodeRouter);

// routes.use(encodeDecodeMiddleware);
routes.use("/user", UserRoutes);

export default routes;
