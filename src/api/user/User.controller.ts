import { Request, Response } from "express";
import {
  createApiResponse,
  createAsyncHandler,
  createPaginatedResponse
} from "../../helpers/api/Api.helper";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import {
  createUser,
  deleteUser,
  getUserById,
  getAllUsersDetails,
  updateUser
} from "./User.service";
import { IUser } from "./User.defination";

export const getUser = createAsyncHandler(async (req: Request, res: Response) => {
  const user = await getUserById(req.params.id);
  res
    .status(StatusCodes.OK)
    .json(createApiResponse(StatusCodes.OK, "User fetched successfully", { user }));
});

export const getAllUsers = createAsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { page, limit, sortField, sortOrder, ...filters } = req.query;

    const query = {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      sortField: sortField ? String(sortField) : undefined,
      sortOrder: sortOrder ? (String(sortOrder) as "asc" | "desc") : undefined,
      filters: filters as Record<string, any>
    };

    const { users, total } = await getAllUsersDetails(query);

    res
      .status(StatusCodes.OK)
      .json(
        createPaginatedResponse(
          StatusCodes.OK,
          "Users fetched successfully",
          "users",
          users,
          total,
          query.page || 1,
          query.limit || 10,
          query.sortField,
          query.sortOrder
        )
      );
  }
);

export const createNewUser = createAsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const user = await createUser(req.body);
    res
      .status(StatusCodes.CREATED)
      .json(createApiResponse(StatusCodes.CREATED, "User created successfully", { user }));
  }
);

export const updateExistingUser = createAsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const updatedUser = await updateUser(req.params.id, req.body);
    res
      .status(StatusCodes.OK)
      .json(createApiResponse(StatusCodes.OK, "User updated successfully", { user: updatedUser }));
  }
);

export const deleteExistingUser = createAsyncHandler(async (req: Request, res: Response) => {
  const deletedUser = await deleteUser(req.params.id);
  console.log(deletedUser, "deletedUser");
  res
    .status(StatusCodes.OK)
    .json(createApiResponse(StatusCodes.OK, "User deleted successfully", {}));
});
