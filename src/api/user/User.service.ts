import { IUser, IUserQuery } from "./User.defination";
import User from "./User.model";
import { createApiErrorResponse } from "../../helpers/api/Api.helper";

export const getUserById = async (id: string): Promise<IUser | null> => {
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw createApiErrorResponse(404, "User not found", error);
  }
};

export const getAllUsersDetails = async (
  query: IUserQuery
): Promise<{ users: IUser[]; total: number }> => {
  const { page = 1, limit = 10, sortField = "createdAt", sortOrder = "asc", filters } = query;
  const skip = (page - 1) * limit;
  const sort: {} = { [sortField]: sortOrder === "asc" ? 1 : -1 };
  const matchStage = { isDeleted: { $ne: true }, ...filters };

  let users: IUser[] = [];
  let total: number = 0;

  const result = await User.aggregate([
    { $match: matchStage },
    { $sort: sort },
    { $skip: skip },
    { $limit: limit },
    {
      $facet: {
        users: [{ $match: matchStage }, { $sort: sort }, { $skip: skip }, { $limit: limit }],
        total: [
          {
            $count: "count"
          }
        ]
      }
    },
    {
      $project: {
        users: 1,
        total: { $arrayElemAt: ["$total.count", 0] }
      }
    }
  ]).exec();
  users = result[0]?.users || [];
  total = result[0]?.total || 0;
  return { users, total };
};

export const createUser = async (user: IUser): Promise<IUser> => {
  const newUser = new User(user);
  await newUser.save();
  return user;
};

export const updateUser = async (id: string, user: IUser): Promise<IUser | null> => {
  try {
    const updatedUser = await User.findByIdAndUpdate(id, user, { new: true });
    if (!updatedUser) {
      throw new Error("User not found");
    }
    return updatedUser;
  } catch (error) {
    throw createApiErrorResponse(404, "User not found", error);
  }
};

export const deleteUser = async (id: string): Promise<IUser | null> => {
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    if (user.isDeleted) {
      throw new Error("User already deleted");
    }
    const updatedUser = await User.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    return updatedUser;
  } catch (error) {
    throw createApiErrorResponse(404, "User not found", error);
  }
};
