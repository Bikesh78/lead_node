import express from "express"
import { login, signUp } from "../controller/auth"

const router = express.Router()

router.post("/sign-up",signUp)
router.post("/login",login)

export {router as authRouter}
