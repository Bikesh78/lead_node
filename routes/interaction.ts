import express from "express"
import { getInteraction } from "../controller/interaction"

const router = express.Router()

router.get("/",getInteraction)

export {router as interactionRouter}
