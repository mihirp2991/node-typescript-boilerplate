import { decodeData, encodeData } from "../../../api/encodeDecode/encodeDecode.controller";
import { Router } from "express";

const EncodeDecodeRouter = Router();

EncodeDecodeRouter.post("/encode", encodeData);
EncodeDecodeRouter.post("/decode", decodeData);

export default EncodeDecodeRouter;
