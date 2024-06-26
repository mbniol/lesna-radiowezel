import { Router } from "express";
import { renderViewChainable, renderView } from "../helpers/helpers.js";
import {
  checkAdmin,
  checkNotAdmin,
  loginSpotify,
} from "../middlewares/checkAdmin.js";

const router = new Router();

router.get(
  "/admin/login",
  checkNotAdmin,
  renderViewChainable("admin/login.html")
);

router.get("/", renderViewChainable("voting.html"));

router.get(
  "/admin",
  checkAdmin,
  renderViewChainable("admin/song_control.html")
);

router.get("*", renderViewChainable("404.html"));

export default router;
