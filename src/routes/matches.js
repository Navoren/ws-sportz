import { Router } from "express";
import { createMatchSchema } from "../validation/matches";
import { db } from "../db/index.js";
export const matchesRouter = Router();

matchesRouter.get("/", (req, res) => {
  res.json({ message: "List of matches" });
});

matchesRouter.post("/", async (req, res) => {
  const parsed = createMatchSchema.safeParse(req.body);
  const {data: {startTime, endTime, homeScore, awayScore}} = parsed;

  if(!parsed.success){
    return res.status(400).json({ errors: parsed.error.errors });
  }

  try {
    const [event] = await db.insert(matches).values({
        ...parsed.data,
        startTime: new Date(parsed.data.startTime),
        endTime: new Date(parsed.data.endTime),
        homeScore: parsed.data.homeScore ?? 0,
        awayScore: parsed.data.awayScore ?? 0,
        status: getMatchStatus(parsed.data.startTime, parsed.data.endTime),
    }).returning();
    return res.status(201).json({ data: event});
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});