import { agent as request } from "supertest";
import app from "../app";
import { appDataSource } from "../utils/db";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../utils/config";
import { Lead, LeadStatus, Source } from "../entity/lead";

type LeadType = {
  lead_name: string;
  email: string;
  lead_status: LeadStatus;
  source: Source;
};

const INITIAL_LEADS: LeadType[] = [
  {
    lead_name: "Lead one",
    email: "lead@one.com",
    lead_status: "New",
    source: "Web",
  },
  {
    lead_name: "Lead two",
    email: "lead@two.com",
    lead_status: "Qualified",
    source: "Referral",
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

  for await (const initial_lead of INITIAL_LEADS) {
    const lead = new Lead();
    lead.lead_name = initial_lead.lead_name;
    lead.email = initial_lead.email;
    lead.lead_status = initial_lead.lead_status;
    lead.source = initial_lead.source;

    await lead.save();
  }
});

afterEach(async () => {
  // close connection to database
  await appDataSource.destroy();
});

describe("Lead API", () => {
  describe("GET /api/lead", () => {
    it("should return a list of leads", async () => {
      const response = await request(app)
        .get("/api/lead")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);

      const leadsAtEnd = await leadsInDb();
      expect(leadsAtEnd).toHaveLength(2);
      const leadNames = leadsAtEnd.map((lead) => lead.lead_name);
      expect(leadNames).toContain("Lead one");
    });
  });

  describe("POST /api/lead", () => {
    const newLead = {
      name: "Lead three",
      email: "lead@three.com",
      lead_status: "Qualified",
      source: "Referral",
    };

    it("should add a new lead", async () => {
      const leadsAtStart = await leadsInDb();
      await request(app)
        .post("/api/lead")
        .send(newLead)
        .set("Authorization", `Bearer ${token}`)
        .expect(201);

      const leadsAtEnd = await leadsInDb();

      expect(leadsAtEnd).toHaveLength(leadsAtStart.length + 1);
      const leadNames = leadsAtEnd.map((lead) => lead.lead_name);
      expect(leadNames).toContain("Lead three");
    });

    it("should have added_date", async () => {
      await request(app)
        .post("/api/lead")
        .send(newLead)
        .set("Authorization", `Bearer ${token}`)
        .expect(201);

      const leads = await leadsInDb();

      leads.forEach((lead) => {
        expect(lead.added_date).toBeDefined();
      });
    });
  });

  describe("PUT /api/lead/:id", () => {
    it("should update an existing lead", async () => {
      const leadsAtStart = await leadsInDb();
      const leadId = leadsAtStart[0].id;
      const changedLead = {
        name: "Changed Lead",
        email: "changed@lead.com",
        lead_status: "Qualified",
        source: "Referral",
      };

      const response = await request(app)
        .put(`/api/lead/${leadId}`)
        .send(changedLead)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      const leadsAtEnd = await leadsInDb();
      expect(leadsAtEnd).toHaveLength(leadsAtStart.length);
      const leadNames = leadsAtEnd.map((lead) => lead.lead_name);
      expect(leadNames).toContain("Changed Lead");
    });
  });

  describe("DELETE /lead/:id", () => {
    it("should delete an existing lead", async () => {
      const leadsAtStart = await leadsInDb();
      const leadId = leadsAtStart[0].id;

      const response = await request(app)
        .delete(`/api/lead/${leadId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(204);
      const leadsAtEnd = await leadsInDb();
      expect(leadsAtEnd).toHaveLength(leadsAtStart.length - 1);
      const leadNames = leadsAtEnd.map((lead) => lead.lead_name);
      expect(leadNames).not.toContain("Lead one");
    });
  });
});
