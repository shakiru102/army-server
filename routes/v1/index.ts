import { Router } from "express";
import UserRoutes from "./users/userRoutes"
import LeaderboardRoutes from "./leaderboard/leaderboardRoutes"
import AdminRoutes from "./admin/adminRoutes"

const router = Router()

router.use("/user", UserRoutes)
router.use("/leaderboard", LeaderboardRoutes)
router.use("/admin", AdminRoutes)

export default router;