import { Router } from "express";
import { postCapsule } from "../controllers/capsules.controller";
import { asyncHandler } from "../middlewares/errorHandler";

export const capsulesRouter = Router();

capsulesRouter.post("/", asyncHandler(postCapsule));