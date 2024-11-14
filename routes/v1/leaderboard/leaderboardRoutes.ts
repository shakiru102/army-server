import {  Router } from "express";
import { userAuth } from "../../../middlewares/auth";
import { getLeaderboard, getRanks } from "../../../controllers/v1/user";


const router = Router()

router.use(userAuth)
router.get("/", getLeaderboard)
router.get("/ranks", getRanks)

export default router