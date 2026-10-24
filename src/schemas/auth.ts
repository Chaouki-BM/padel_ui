import { z } from "zod";
import { LEVEL_CODES } from "@/lib/constants";

export const authTokensSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
});

export type AuthTokens = z.infer<typeof authTokensSchema>;

export const loginBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type LoginBody = z.infer<typeof loginBodySchema>;

export const registerBodySchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(/[A-Za-z]/, "letter")
    .regex(/\d/, "digit"),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  nationality: z.literal("TN"),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  city: z.string().min(1),
  level: z.enum(LEVEL_CODES).optional(),
  position: z.string().optional(),
  dominantHand: z.enum(["LEFT", "RIGHT", "AMBIDEXTROUS"]).optional(),
  phone: z.string().optional(),
});

export type RegisterBody = z.infer<typeof registerBodySchema>;

export const forgotPasswordBodySchema = z.object({
  email: z.string().email(),
});

export const resetPasswordBodySchema = z.object({
  token: z.string().min(1),
  password: z
    .string()
    .min(8)
    .regex(/[A-Za-z]/, "letter")
    .regex(/\d/, "digit"),
});

export const verifyEmailBodySchema = z.object({
  token: z.string().min(1),
});

export const meProfileSchema = z
  .object({
    firstName: z.string().nullable().optional(),
    lastName: z.string().nullable().optional(),
    phone: z.string().nullable().optional(),
    city: z.string().nullable().optional(),
    nationality: z.string().nullable().optional(),
    birthDate: z.string().nullable().optional(),
    level: z.string().nullable().optional(),
    position: z.string().nullable().optional(),
    dominantHand: z.string().nullable().optional(),
    licenceCode: z.string().nullable().optional(),
    age: z.number().nullable().optional(),
    rating: z.number().nullable().optional(),
    behaviourStatus: z.string().nullable().optional(),
  })
  .passthrough();

export const meAccountSchema = z
  .object({
    id: z.string(),
    email: z.string().email(),
    role: z.string(),
    emailVerified: z.boolean().optional().default(false),
    profile: meProfileSchema.nullable().optional(),
    firstName: z.string().nullable().optional(),
    lastName: z.string().nullable().optional(),
  })
  .passthrough();

export type MeAccount = z.infer<typeof meAccountSchema>;

export const updateProfileBodySchema = z
  .object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().nullable().optional(),
    city: z.string().optional(),
    nationality: z.string().optional(),
    birthDate: z.string().nullable().optional(),
    level: z.enum(LEVEL_CODES).nullable().optional(),
    position: z.string().nullable().optional(),
    dominantHand: z.enum(["LEFT", "RIGHT", "AMBIDEXTROUS"]).nullable().optional(),
    licenceCode: z.string().nullable().optional(),
  })
  .strict();

export type UpdateProfileBody = z.infer<typeof updateProfileBodySchema>;

export const notificationSchema = z
  .object({
    id: z.string(),
    title: z.string().optional(),
    body: z.string().optional(),
    message: z.string().optional(),
    readAt: z.string().nullable().optional(),
    createdAt: z.string().optional(),
    type: z.string().optional(),
  })
  .passthrough();

export const notificationsResponseSchema = z
  .object({
    items: z.array(notificationSchema).optional(),
    notifications: z.array(notificationSchema).optional(),
    unreadCount: z.number().int().nonnegative().optional().default(0),
  })
  .passthrough()
  .transform((data) => ({
    items: data.items ?? data.notifications ?? [],
    unreadCount: data.unreadCount ?? 0,
  }));

export const behaviourResponseSchema = z
  .object({
    infractions: z.array(z.unknown()).optional().default([]),
    sanctions: z.array(z.unknown()).optional().default([]),
    appeals: z.array(z.unknown()).optional().default([]),
    status: z.string().optional(),
  })
  .passthrough();

export const appealBodySchema = z.object({
  sanctionId: z.string().optional(),
  message: z.string().min(1),
});
