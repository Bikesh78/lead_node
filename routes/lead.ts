import express from "express";
import { addLead, getLead } from "../controller/lead";

const router = express.Router();

router.get("/", getLead);
router.post("/", addLead);

export { router as leadRouter };
