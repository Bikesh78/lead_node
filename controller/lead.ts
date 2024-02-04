import { NextFunction, Response, Request } from "express";
import { Lead, LeadStatus, Source } from "../entity/lead";
import { validate } from "class-validator";

export const getLead = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const lead = await Lead.find();
    res.json({ data: lead });
  } catch (error) {
    next(error);
  }
};

interface LeadBody {
  name: string;
  email: string;
  status: LeadStatus;
  source: Source;
}

export const addLead = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const body: LeadBody = req.body;
    const { name, email, status, source } = body;
    const lead = new Lead();
    lead.lead_name = name;
    lead.email = email;
    lead.lead_status = status;
    lead.source = source;

    const errors = await validate(lead);
    if (errors.length > 0) {
      next(errors);
    }

    await lead.save();
    res.status(201).json({ message: "Successfully added lead", ...lead });
  } catch (error) {
    next(error);
  }
};
