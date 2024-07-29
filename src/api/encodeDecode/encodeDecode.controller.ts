import { StatusCodes } from "http-status-codes";
import { decrypt, encrypt } from "../../helpers/encodeDecode/encodeDecode.helper";
import { Request, Response } from "express";
import { createApiResponse } from "../../helpers/api/Api.helper";

export const encodeData = async (req: Request, res: Response): Promise<any> => {
  if (req.body && req.body.data) {
    const encodedBody = encrypt(JSON.stringify(req.body.data));
    res
      .status(StatusCodes.OK)
      .json(createApiResponse(StatusCodes.OK, "Data Encoded successfully", encodedBody));
  }
};

export const decodeData = async (req: Request, res: Response): Promise<any> => {
  //   debugger;
  if (req.body && req.body.data) {
    let decodedBody = {};
    if (typeof req.body.data === "string") {
      decodedBody = JSON.parse(decrypt(req.body.data));
    } else if (typeof req.body.data === "object") {
      decodedBody = JSON.parse(decrypt(JSON.stringify(req.body.data)));
    }
    res
      .status(StatusCodes.OK)
      .json(createApiResponse(StatusCodes.OK, "Data Decoded successfully", decodedBody));
  }
};
