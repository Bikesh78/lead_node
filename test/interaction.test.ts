import { agent as request } from "supertest";
import app from "../app";
import { appDataSource } from "../utils/db";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../utils/config";
import { Lead, LeadStatus, Source } from "../entity/lead";
import { Interaction, InteractionType } from "../entity/interaction";

interface DataType {
  interaction_type: InteractionType;
  lead_name: string;
  email: string;
  lead_status: LeadStatus;
  source: Source;
}

const INITIAL_DATA: DataType[] = [
  {
    lead_name: "Lead one",
    email: "lead@one.com",
    lead_status: "New",
    source: "Web",
    interaction_type: "Email",
  },
  {
    lead_name: "Lead two",
    email: "lead@two.com",
    lead_status: "Qualified",
    source: "Referral",
    interaction_type: "Call",
  },
];

const generateToken = () => {
  const userForToken = {
    id: 5000,
    username: "test@name.com",
  };
  const token = jwt.sign(userForToken, TOKEN_SECRET, { expiresIn: "1d" });
  return token;
};

const leadsInDb = async () => {
  const leads = await Lead.find();
  return leads;
};

const interactionInDb = async () => {
  const interactions = await Interaction.find();
  return interactions;
};

let token: string;
beforeEach(async () => {
  // connect to database
  await appDataSource.initialize();

  // empty the database
  const entities = appDataSource.entityMetadatas;
  for await (const entity of entities) {
    appDataSource.createQueryBuilder().delete().from(entity.name).execute();
  }

  token = generateToken();

  for await (const data of INITIAL_DATA) {
    const lead = new Lead();
    lead.lead_name = data.lead_name;
    lead.email = data.email;
    lead.lead_status = data.lead_status;
    lead.source = data.source;

    await lead.save();

    const interaction = new Interaction();
    interaction.interaction_type = data.interaction_type;
    interaction.lead = lead;

    await interaction.save();
  }
});

afterEach(async () => {
  // close connection to database
  await appDataSource.destroy();
});

describe("Interaction API", () => {
  describe("GET /api/interaction", () => {
    it("should return a list of interactions", async () => {
      const response = await request(app)
        .get("/api/interaction")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);

      const interactionsAtEnd = await interactionInDb();
      expect(interactionsAtEnd).toHaveLength(2);
    });
  });

  describe("POST /api/interaction", () => {
    it("should add a new interaction", async () => {
      const interactionsAtStart = await interactionInDb();

      const leads = await leadsInDb();
      const newInteraction = {
        lead_id: leads[0].id,
        interaction_type: "Meeting",
      };

      const response = await request(app)
        .post("/api/interaction")
        .send(newInteraction)
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(201);

      const interactionsAtEnd = await interactionInDb();

      expect(interactionsAtEnd).toHaveLength(interactionsAtStart.length + 1);
      const interactionNames = interactionsAtEnd.map(
        (interaction) => interaction.interaction_type,
      );
      expect(interactionNames).toContain("Meeting");
    });

    it("should change status of lead to contacted", async () => {
      const leads = await leadsInDb();
      const newInteraction = {
        lead_id: leads[0].id,
        interaction_type: "Meeting",
      };
      await request(app)
        .post("/api/interaction")
        .send(newInteraction)
        .set("Authorization", `Bearer ${token}`)
        .expect(201);

      const leadsAtEnd = await leadsInDb();

      const leadStatus = leadsAtEnd.find(
        (lead) => lead.lead_name === "Lead one",
      );
      expect(leadStatus?.lead_status).toBe("Contacted");
    });
  });

  describe("PUT /api/interaction/:id", () => {
    it("should update an existing interaction", async () => {
      const interactionsAtStart = await interactionInDb();
      const interActionId = interactionsAtStart[0].id;
      const changedInteraction = {
        interaction_type: "Meeting",
      };

      const response = await request(app)
        .put(`/api/interaction/${interActionId}`)
        .send(changedInteraction)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      const interactionsAtEnd = await interactionInDb();
      expect(interactionsAtEnd).toHaveLength(interactionsAtStart.length);
      const interactionType = interactionsAtEnd.map(
        (interaction) => interaction.interaction_type,
      );
      expect(interactionType).toContain("Meeting");
    });
  });

  describe("DELETE /api/interaction/:id", () => {
    it("should delete an existing interaction", async () => {
      const interactionsAtStart = await interactionInDb();
      const interactionId = interactionsAtStart[0].id;

      const response = await request(app)
        .delete(`/api/interaction/${interactionId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(204);
      const interactionsAtEnd = await interactionInDb();
      expect(interactionsAtEnd).toHaveLength(interactionsAtStart.length - 1);
    });
  });
});
