import { Router } from "express";
import { awardBonusPoints, getUserProfile, signin } from "../../../controllers/v1/user";
import { userAuth } from "../../../middlewares/auth";


const router = Router()
 

router.post("/", signin)
router.use(userAuth)
router.get('/profile', getUserProfile)
router.get('/bonus/:id', awardBonusPoints)

export default router