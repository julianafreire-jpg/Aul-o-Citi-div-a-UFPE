import type { Request, Response } from "express";
import { z } from "zod";
import type { ApiResponse, Capsule } from "@repo/types";
import { createCapsule } from "../services/capsules.service";

const createCapsuleSchema = z.object({
  recipientEmail: z.string().trim().email().max(254),
  subject: z.string().trim().min(1).max(120),
  message: z.string().trim().min(1).max(10_000),
  paperColor: z.enum(["ivory", "rose", "sky", "sage"]),
  decoration: z.enum(["botanical", "celestial", "pressed"]),
  stamps: z.array(z.enum(["flower", "star", "heart"])).max(3),
});

export async function postCapsule(
  req: Request,
  res: Response<ApiResponse<Capsule | null>>,
) {
  const parsed = createCapsuleSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      data: null,
      error: "Confira o e-mail, o assunto e a mensagem da sua cápsula.",
    });
  }

  const capsule = await createCapsule(parsed.data);
  return res.status(201).json({
    data: capsule,
    message: "Sua carta foi selada para daqui a dois anos.",
  });
}