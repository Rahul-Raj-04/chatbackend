import { Router } from "express";
import {
  deleteUser,
  getAllUsers,
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  updateUser,
  uploadProfilePhoto,
  getStatus,
  updateUserPrivacy,
  removeProfilePhoto
} from "./User.controler.js";
import { upload } from "../../middlewares/FileUpload.middlwares.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "profilePhoto",
      maxCount: 1
    }
  ]),
  registerUser
);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.route("/alluser").get(getAllUsers);
router.route("/update").patch(updateUser);
router.route("/delete").delete(deleteUser);
router.route("/currentuser").get(getCurrentUser);
router.route("/getstatus").get(getStatus);
router.route("/removeprofilephoto").post(
  upload.fields([
    {
      name: "profilePhoto",
      maxCount: 1
    }
  ]), removeProfilePhoto);
router.route("/profilephoto").post(
  upload.fields([
    {
      name: "profilePhoto",
      maxCount: 1
    }
  ]), uploadProfilePhoto);
router.route("/privacy").patch(updateUserPrivacy);
export default router;
