import { NextFunction, Response, Request } from "express";
import { Lead, LeadStatus, Source } from "../entity/lead";
import { validate } from "class-validator";

interface LeadBody {
  name: string;
  email: string;
  status: LeadStatus;
  source: Source;
}

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

export const updateLead = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const body: LeadBody = req.body;
    const { name, email, status, source } = body;
    const id = Number(req.params.id);

    const lead = await Lead.findOneBy({ id });
    if (!lead) {
      return res.status(404).json({ error: "Item not found" });
    }

    lead.lead_name = name;
    lead.email = email;
    lead.lead_status = status;
    lead.source = source;

    const errors = await validate(lead);
    if (errors.length > 0) {
      next(errors);
    }

    await lead.save();
    res.status(200).json({ message: "Successfully updated lead", ...lead });
  } catch (error) {
    next(error);
  }
};

export const deleteLead = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);
    const lead = await Lead.findOneBy({ id });
    if (!lead) {
      return res.status(404).json({ error: "Item not found" });
    }

    await lead.remove();
    res.status(204).json({ message: "Successfully deleted lead", ...lead });
  } catch (error) {
    next(error);
  }
};
