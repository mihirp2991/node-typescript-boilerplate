import { StatusCodes } from "http-status-codes";
import { createApiResponse } from "../../helpers/api/Api.helper";
import { decrypt, encrypt } from "../../helpers/encodeDecode/encodeDecode.helper";
import { Request, Response, NextFunction } from "express";

export default function encodeDecodeMiddleware(req: Request, res: Response, next: NextFunction) {
  // Decode request body
  if (req.body && req.body.data) {
    try {
      const decryptedBody = decrypt(req.body.data);
      req.body = JSON.parse(decryptedBody);
    } catch (err) {
      return res.status(400).send("Invalid request body");
    }
  }

  // Encode response body
  const originalSend = res.send;
  res.send = function (body: any) {
    if (typeof body === "string") {
      body = JSON.stringify(
        createApiResponse(StatusCodes.OK, "Data Get successfully", encrypt(body))
      );
    } else if (typeof body === "object") {
      body = JSON.stringify(
        createApiResponse(StatusCodes.OK, "Data Get successfully", encrypt(JSON.stringify(body)))
      );
    }
    return originalSend.call(this, body);
  };

  next();
}
