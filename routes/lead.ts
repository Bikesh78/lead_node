import express from "express";
import { addLead, deleteLead, getLead, updateLead } from "../controller/lead";

const router = express.Router();

router.get("/", getLead);
router.post("/", addLead);
router.put("/:id", updateLead);
router.delete("/:id", deleteLead);

export { router as leadRouter };
