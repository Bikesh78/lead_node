import { NextFunction, Response, Request } from "express";
import { validate } from "class-validator";
import { Interaction, InteractionType } from "../entity/interaction";
import { Lead } from "../entity/lead";

export const getInteraction = async (
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
        relations: {
          lead: true,
        },
        take: limit,
        skip,
        order: {
          interaction_date: "DESC",
        },
      });

      return res.json({
        data: lead,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      });
    }

    const interaction = await Interaction.find({
      relations: {
        lead: true,
      },
      order: {
        interaction_date: "DESC",
      },
      // select: {
      //   lead: {
      //     id: true,
      //     lead_name:true,
      //     lead_status:true,
      //   },
      // },
    });

    res.json({ data: interaction });
  } catch (error) {
    next(error);
  }
};

interface InteractionBody {
  lead_id: number;
  interaction_type: InteractionType;
}

export const addInteraction = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const body: InteractionBody = req.body;
    const { lead_id, interaction_type } = body;
    const interaction = new Interaction();
    interaction.interaction_type = interaction_type;

    const lead = await Lead.findOne({
      where: {
        id: lead_id,
      },
    });
    if (!(lead_id && lead)) {
      return res.status(404).json({ error: `Lead not found` });
    }
    if (lead?.lead_status === "New") {
      lead.lead_status = "Contacted";
    }
    await lead.save();

    interaction.lead = lead;

    const errors = await validate(interaction);
    if (errors.length > 0) {
      next(errors);
    }

    await interaction.save();
    res
      .status(201)
      .json({ message: "Successfully added interaction", ...interaction });
  } catch (error) {
    next(error);
  }
};

export const updateInteraction = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const body = req.body;
    const { interaction_type } = body;
    const id = Number(req.params.id);

    const interaction = await Interaction.findOneBy({ id });
    if (!interaction) {
      return res.status(404).json({ error: `Interaction ${id} not found` });
    }
    interaction.interaction_type = interaction_type;

    const errors = await validate(interaction);
    if (errors.length > 0) {
      next(errors);
    }

    await interaction.save();
    res.status(200).json({
      message: "Successfully updated interaction",
      ...interaction,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteInteraction = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);
    const interaction = await Interaction.findOneBy({ id });
    if (!interaction) {
      return res.status(404).json({ error: `Interaction ${id} not found` });
    }

    await interaction.remove();
    res
      .status(204)
      .json({ message: "Successfully deleted interaction", ...interaction });
  } catch (error) {
    next(error);
  }
};

export const getInteractionByLead = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const paginate = Number(req.query.paginate);
    const leadId = Number(req.params.lead_id);

    const lead = await Lead.findOneBy({ id: leadId });
    if (!(leadId && lead)) {
      return res.status(404).json({ error: `Lead ${leadId} not found` });
    }

    let paginationOption: any = {};
    if (paginate === 1) {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      paginationOption.take = limit;
      paginationOption.skip = skip;

      const [lead, total] = await Interaction.findAndCount({
        where: {
          lead: {
            id: leadId,
          },
        },
        relations: {
          lead: true,
        },
        select: {
          lead: {
            id: true,
            lead_name: true,
          },
        },
        take: limit,
        skip,
        order: {
          interaction_date: "DESC",
        },
      });

      return res.json({
        data: lead,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      });
    }

    const interaction = await Interaction.find({
      where: {
        lead: {
          id: leadId,
        },
      },
      relations: {
        lead: true,
      },
      select: {
        lead: {
          id: true,
          lead_name: true,
        },
      },
    });

    res.json({ data: interaction });
  } catch (error) {
    next(error);
  }
};
