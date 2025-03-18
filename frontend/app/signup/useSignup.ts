"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { hc } from "hono/client";
import type { ApiRoutes } from "../../../../position_management/src/app";



const signupSchema = z.object({
  name: z.string().min(1, "Enter a name"),
  email: z.string().email("Enter a valid email"),
  description: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignupData = z.infer<typeof signupSchema>;

export default function useSignup() {

  const client: any = hc<ApiRoutes>("http://localhost:3000/");

  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting },} = useForm<SignupData>({resolver: zodResolver(signupSchema),});

  const onSubmit = async (data: SignupData) => {
    setServerError("");

    try {
      const response = await client.auth.signup.$post({
        json: data, 
      });

      const result = await response.json()
      
      if (!response.ok) {
        setServerError(result.error || result.validationErrors || "Login failed. Please try again.");
      } else {
        router.push("/login"); 
      }
    } catch (error) {
      setServerError("Signup failed. Please try again.");
    } 
  };

  return { register, handleSubmit, errors, onSubmit, isSubmitting, serverError };
}
