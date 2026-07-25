"use client";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, ArrowRight } from "lucide-react";
import { leadFormSchema, type LeadFormValues } from "@/lib/validations";
import { api } from "@/lib/api";
import { AnimatedInput } from "./AnimatedInput";
import { AnimatedTextarea } from "./AnimatedTextarea";
import { BudgetSlider } from "./BudgetSlider";
import { cn } from "@/lib/utils";
import { staggerContainer, staggerItem, fadeInUp } from "@/lib/animations";

export const LeadForm = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      budget: 10000,
      message: "",
    },
  });

  const emailValue = watch("email");
  const isValidEmail = emailValue ? !errors.email : false;

  const onSubmit = async (data: LeadFormValues) => {
    try {
      setIsSubmittingForm(true);
      await api.leads.create(data);
      setIsSuccess(true);
    } catch (error) {
      console.error("Failed to submit form", error);
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const resetForm = () => {
    reset();
    setIsSuccess(false);
  };

  return (
    <div className="w-full max-w-xl mx-auto p-8 rounded-3xl glass shadow-2xl relative overflow-hidden">
      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.form
            key="form"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <motion.div variants={staggerItem} className="space-y-6">
              <AnimatedInput
                label="Full Name"
                {...register("name")}
                error={errors.name?.message}
              />

              <AnimatedInput
                label="Email Address"
                type="email"
                {...register("email")}
                error={errors.email?.message}
                isValid={isValidEmail && emailValue.length > 0}
              />

              <Controller
                control={control}
                name="budget"
                render={({ field }) => (
                  <BudgetSlider
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.budget?.message}
                  />
                )}
              />

              <AnimatedTextarea
                label="Project Details"
                {...register("message")}
                error={errors.message?.message}
              />
            </motion.div>

            <motion.div variants={staggerItem}>
              <button
                type="submit"
                disabled={isSubmittingForm}
                className={cn(
                  "w-full py-4 px-6 rounded-xl text-white font-semibold text-lg flex items-center justify-center space-x-2 transition-all duration-300 cursor-pointer",
                  "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/40 ring-2 ring-blue-500/20 hover:shadow-blue-500/60",
                  isSubmittingForm &&
                    "opacity-80 cursor-not-allowed scale-[0.98]",
                )}
              >
                {isSubmittingForm ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Inquiry</span>
                    <Send className="w-5 h-5" />
                  </>
                )}
              </button>
            </motion.div>
          </motion.form>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className="relative mb-6">
              <motion.svg
                viewBox="0 0 50 50"
                className="w-24 h-24 text-emerald-400"
                fill="none"
                strokeWidth="3"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <motion.circle
                  cx="25"
                  cy="25"
                  r="20"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
                <motion.path
                  d="M15 25 l7 7 l13 -13"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
                />
              </motion.svg>
            </div>

            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-3xl font-bold mb-2"
            >
              Inquiry Sent!
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-[hsl(var(--muted-foreground))] mb-8"
            >
              We'll contact you within 24 hours.
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              onClick={resetForm}
              className="px-6 py-2 rounded-full border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))] transition-colors flex items-center space-x-2 cursor-pointer"
            >
              <span>Send Another</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
