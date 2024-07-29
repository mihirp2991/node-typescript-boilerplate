import {
  createNewUser,
  deleteExistingUser,
  getUser,
  getAllUsers,
  updateExistingUser
} from "../../../api/user/User.controller";
import { Router } from "express";

const UserRoutes = Router();

UserRoutes.route("/").get(getAllUsers);
UserRoutes.route("/:id").get(getUser);
UserRoutes.route("/").post(createNewUser);
UserRoutes.route("/:id").put(updateExistingUser);
UserRoutes.route("/:id").delete(deleteExistingUser);

export default UserRoutes;
