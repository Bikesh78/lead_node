import { NextFunction, Response, Request } from "express";
import { Lead, LeadStatus, Source } from "../entity/lead";
import { validate } from "class-validator";
import { Between } from "typeorm";

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
    const addedDate = req.query.added_date as string;
    const paginate = Number(req.query.paginate);
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const skip = (page - 1) * limit;

    let where: any = {};
    if (addedDate) {
      const startDate = new Date(addedDate);
      const endDate = new Date(addedDate);
      endDate.setDate(endDate.getDate() + 1);
      where.added_date = Between(startDate, endDate);
    }

    // let paginationOption: any = {};
    // if (paginate === 1) {
    //   paginationOption.take = limit;
    //   paginationOption.skip = skip;
    // }

    const [lead, total] = await Lead.findAndCount({
      where,
      // ...paginationOption,
      take: limit,
      skip,
    });

    res.json({
      data: lead,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
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
