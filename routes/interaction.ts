import express from "express";
import {
  addInteraction,
  deleteInteraction,
  getInteraction,
  updateInteraction,
} from "../controller/interaction";

const router = express.Router();

router.get("/", getInteraction);
router.post("/", addInteraction);
router.put("/:id", updateInteraction);
router.delete("/:id", deleteInteraction);

export { router as interactionRouter };
