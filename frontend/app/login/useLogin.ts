"use client";

import { hc } from "hono/client";
import { z } from "zod";
import { useRouter } from "next/navigation"; // Fix useRouter import
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppType } from "../../../../position_management/src/app";
import client from "@/utils/apiClient";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginData = z.infer<typeof loginSchema>;

export default function useLogin() {

  // const client: any = hc<AppType>("http://localhost:3000/");
  
  const router = useRouter();

  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");

  const { register, handleSubmit,  formState: { errors, isSubmitting },} = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginData) => {
    
    setServerError("");
    setSuccess("");

    try {

        const res = await client.auth.login.$post({
            json: data,
        });

        const result = await res.json(); 

        if (!res.ok) {
            setServerError(result.error || result.validationErrors || "Login failed. Please try again.");
            return;
        }
      
          if (!result.token) {
            setServerError("Invalid server response: No token received.");
            return;
        }
      
        console.log("Token", result.token);

        localStorage.setItem("token", result.token);

        setSuccess("Logged in successfully!");

        setTimeout(() => {
            router.push("/dashboard"), 1500
        });

        } catch (error) {
          console.error("Error:", error);
          setServerError("Something went wrong. Please try again.");
        } finally {
        }
};

  return { register, handleSubmit, errors, onSubmit, isSubmitting, serverError, success };

}
