import { NextFunction, Response, Request } from "express";
import { validate } from "class-validator";
import { Interaction } from "../entity/interaction";


export const getInteraction= async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const paginate = Number(req.query.paginate);


    let paginationOption: any = {};
    if (paginate === 1) {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      paginationOption.take = limit;
      paginationOption.skip = skip;

      const [lead, total] = await Interaction.findAndCount({
        take: limit,
        skip,
      });

      return res.json({
        data: lead,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      });
    }

    const interaction= await Interaction.find({});

    res.json({data: interaction});
  } catch (error) {
    next(error);
  }
};

