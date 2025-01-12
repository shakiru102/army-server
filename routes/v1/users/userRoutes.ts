import { Router } from "express";
import { awardBonusPoints, getUserProfile, linkUserExtendedAddress, signin, unLinkUserExtendedAddress } from "../../../controllers/v1/user";
import { userAuth } from "../../../middlewares/auth";


const router = Router()
 

router.post("/", signin)
router.use(userAuth)
router.get('/profile', getUserProfile)
router.get('/bonus/:id', awardBonusPoints)
router.post('/link-address/:id', linkUserExtendedAddress)
router.post('/unlink-address/:id', unLinkUserExtendedAddress)

export default router