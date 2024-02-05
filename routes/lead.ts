import express from "express";
import {
  addLead,
  deleteLead,
  getLead,
  getLeadsPerSouce,
  getLeadsPerStatus,
  updateLead,
} from "../controller/lead";

const router = express.Router();

router.get("/", getLead);
router.post("/", addLead);
router.put("/:id", updateLead);
router.delete("/:id", deleteLead);
router.get("/lead-per-source", getLeadsPerSouce);
router.get("/lead-per-status", getLeadsPerStatus);

export { router as leadRouter };
