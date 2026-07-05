import { z } from "zod";

export const PROPERTY_TYPES = [
  "APARTMENT",
  "OFFICE",
  "BUILDING",
  "HOUSE",
  "COMMERCIAL",
  "LAND",
] as const;

export const registerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["OWNER", "TENANT"]).default("OWNER"),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const propertySchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  type: z.enum(PROPERTY_TYPES),
  address: z.string().min(3),
  city: z.string().min(2),
  state: z.string().min(2),
  zipCode: z.string().min(3),
  sizeSqft: z.coerce.number().int().positive().optional(),
  numUnits: z.coerce.number().int().positive().optional(),
  price: z.coerce.number().positive().optional(),
  priceType: z.string().optional(),
  images: z
    .array(z.object({ url: z.string().url(), publicId: z.string(), type: z.enum(["IMAGE", "VIDEO"]).optional().default("IMAGE") }))
    .optional(),
});

export const inquirySchema = z.object({
  propertyId: z.string().min(1),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type PropertyInput = z.infer<typeof propertySchema>;
export type InquiryInput = z.infer<typeof inquirySchema>;
