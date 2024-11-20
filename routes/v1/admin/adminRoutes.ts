import { Router } from "express";
import { addCampaignTweets, createCampaign, createRank, syncTweetViews, updateAccessLevel, updateRank, updateUserTag, endCampaign, createTags } from "../../../controllers/v1/admin";
import { adminAuth, superAdminAuth } from "../../../middlewares/auth";
import { isCampaignInActive } from "../../../middlewares/campaign";

const router = Router()
router.use(adminAuth)
router.post("/create-rank", createRank)
router.post("/update-rank/:id", updateRank)
router.post("/campaign", createCampaign)
router.patch("/campaign/:tweetId", isCampaignInActive, syncTweetViews)
router.post("/campaign/:campaignId", isCampaignInActive, addCampaignTweets)
router.put("/campaign/:campaignId", superAdminAuth, isCampaignInActive, endCampaign)
router.post("/update-accesslevel", superAdminAuth ,updateAccessLevel)
router.post("/update-user-tag", superAdminAuth ,updateUserTag)
router.post("/create-tag", superAdminAuth , createTags)

export default router;