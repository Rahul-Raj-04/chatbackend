import { Router } from "express";
import {
  downloadMedia,
} from "./Media.controller.js";
const router = Router();

router.route("/downloadmedia").get(downloadMedia);

export default router;