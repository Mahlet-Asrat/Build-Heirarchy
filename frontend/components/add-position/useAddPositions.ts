"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm, set } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { hc } from "hono/client";
import { ApiRoutes } from "../../../../position_management/src/app";

const addChildSchema = z.object({
  name: z.string().min(1, "Enter a name"),
  description: z.string().optional(),
});


type AddChild = z.infer<typeof addChildSchema>;

export const useAddChildPosition = (parentId:string | null) => {
    
  const [success, setSuccess] = useState("");
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddChild>({ resolver: zodResolver(addChildSchema) });

  const onSubmit = async (data: AddChild) => {
    setServerError("");
    setSuccess("");
    
    const token = localStorage.getItem("token");
    if (!token) {
      setServerError("Unauthorized: Please login first");
      return;
    }

    const client: any = hc<ApiRoutes>("http://localhost:3000/", {
      headers: { Authorization: token },
    });

    try {

      const response = await client.positions.$post({
        json: { ...data, parentId }, 
      });

      if (!response.ok) {
        const result = await response.json();
        setServerError(result.error || result.validationErrors || "Failed to add a child position");
        return;
      }
      setSuccess("Child position added successfully!");
    } catch (error) {
      setServerError("Please try again.");
    }
  };

  return { register, handleSubmit, onSubmit, errors, isSubmitting, serverError, success };
};
