import express from "express";
import {
  addInteraction,
  deleteInteraction,
  getInteraction,
  getInteractionByLead,
  updateInteraction,
} from "../controller/interaction";

const router = express.Router();

router.get("/", getInteraction);
router.post("/", addInteraction);
router.put("/:id", updateInteraction);
router.delete("/:id", deleteInteraction);
router.get("/lead/:lead_id", getInteractionByLead);

export { router as interactionRouter };
