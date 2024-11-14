import { Router } from "express";
import { createRank, updateAccessLevel, updateRank } from "../../../controllers/v1/admin";
import { adminAuth, superAdminAuth } from "../../../middlewares/auth";

const router = Router()
router.use(adminAuth)
router.post("/create-rank", createRank)
router.post("/update-rank/:id", updateRank)
router.post("/update-accesslevel", superAdminAuth ,updateAccessLevel)

export default router;