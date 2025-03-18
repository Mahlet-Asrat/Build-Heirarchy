"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { hc } from "hono/client";
import { ApiRoutes } from "../../../../position_management/src/app";

const updateSchema = z.object({
  name: z.string().min(1, "Enter a name"),
  description: z.string().optional(),
  parentId: z.string().nullable(),
});

export const useUpdatePosition = (positionId: string | null) => {

    const [validParents, setValidParents] = useState([]);

    const [serverError, setServerError] = useState("");

    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue,formState: { errors }} = useForm({ resolver: zodResolver(updateSchema) });

  useEffect(() => {
    if (!positionId) return;
    const token = localStorage.getItem("token");
    if (!token) {
      setServerError("Unauthorized: Please login first");
      return;
    }

    const client: any = hc("http://localhost:3000/", { headers: { Authorization: token } });
    
    const fetchData = async () => {
      try {
        const [positionRes, parentsRes] = await Promise.all([
          client.positions[":id"].$get({ param: { id: positionId } }),
          client.positions.validParent[":id"].$get({ param: { id: positionId } }),
        ]);

        if (positionRes.ok) {
          const positionData = await positionRes.json();
          setValue("name", positionData.name);
          setValue("description", positionData.description || "");
          setValue("parentId", positionData.parentId || "");
        } else {
          setServerError("Failed to load position details");
        }

        if (parentsRes.ok) {
          setValidParents(await parentsRes.json());
        } else {
          setServerError("Failed to load valid parent positions");
        }
      } catch {
        setServerError("Error fetching data");
      }
    };

    fetchData();
  }, [positionId, setValue]);

  const onSubmit = async (data: any) => {
            setServerError("");
            setSuccess("");
            setLoading(true);
            const token = localStorage.getItem("token");
            
            if (!token) {
            setServerError("Unauthorized: Please login first");
            setLoading(false);
            return;
    }

    const client: any = hc("http://localhost:3000/", { headers: 
      { Authorization: token 
        
      } });

    try {

      const response = await client.positions[":id"].$put({ param: { id: positionId }, json: data });

      if (response.ok) {

        setSuccess("Position updated successfully!");

      } else {
        const result = await response.json();
        
        setServerError(result.error || "Failed to update position");
      }
    } catch {
      setServerError("Update failed. Please try again.");
    }
    setLoading(false);
  };

  return { register, handleSubmit, onSubmit, errors, serverError, success, validParents, loading };
};
