import { useState } from "react";
import { hc } from "hono/client";
import { ApiRoutes } from "../../../../position_management/src/app";

export const useDeletePosition = (positionId: string | null) => {
    
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const confirmDelete = async () => {
    if (!positionId) return;

    setLoading(true);
    setError(null);

    if (typeof window === "undefined") {

      setError("Client-side only: localStorage is not available.");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Unauthorized: Please login first");
      setLoading(false);
      return;
    }

    const client: any = hc<ApiRoutes>("http://localhost:3000/", {
      headers: { Authorization: token },
    });

    try {
      const response = await client.positions[":id"].$delete({
        param: { id: positionId },
      });

      if (response.ok) {
        alert("Position deleted successfully!");
        window.location.reload();
      } else {
        const result = await response.json();
        setError(result.error || "Failed to delete position");
        alert(result.error || "Failed to delete position");
      }
    } catch {
      setError("Server error. Please try again later.");
      alert("Server error. Please try again later.");
    }

    setLoading(false);
  };

  return { error, loading, confirmDelete };
};
