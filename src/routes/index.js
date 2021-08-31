import { Router } from "express";
import auth from "./auth.routes";
import index from "./index.routes";
import links from "./links.routes";
import user from "./user.routes";
import admin from "./admin.routes";

const router = Router();

router.use(index);
router.use(auth);
router.use(user);
router.use("/links", links);
router.use("/admin", admin);

export default router;