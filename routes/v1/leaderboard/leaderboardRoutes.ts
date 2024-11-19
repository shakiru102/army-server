import {  Router } from "express";
import { userAuth } from "../../../middlewares/auth";
import { getCampaigns, getLeaderboard, getRanks, getTags } from "../../../controllers/v1/user";


const router = Router()

router.use(userAuth)
router.get("/", getLeaderboard)
router.get("/ranks", getRanks)
router.get("/campaign", getCampaigns)
router.get("/tags", getTags)


export default router