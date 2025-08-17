import express from "express"
import { authUser, getUserProfile, logoutUser, registerUser } from "../controllers/user.controller"
import { protect } from "../middleware/auth"

const router = express.Router()

router.post('/', registerUser)
router.post('/auth', authUser)
router.post('/logout', logoutUser)

router.route('/:username').get(protect, getUserProfile)

export default router