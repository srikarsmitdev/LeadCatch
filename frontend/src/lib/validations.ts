import { z } from "zod";

export const leadFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  email: z
    .string()
    .email("Please enter a valid email address"),
  budget: z
    .number()
    .min(1000, "Budget must be at least $1,000")
    .max(100000, "Budget must be less than $100,000"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1,000 characters"),
});

export type LeadFormValues = z.infer<typeof leadFormSchema>;
