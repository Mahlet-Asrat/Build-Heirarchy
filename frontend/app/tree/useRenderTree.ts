import { useState, useEffect } from "react";
import { hc } from "hono/client";
import { ApiRoutes } from "../../../../position_management/src/app";

export const useTree = () => {

  const [treeData, setTreeData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  
  if (!token) {
    console.error("Unauthorized, Please Login");
    return { treeData, fetchChildren: async () => [], treeHook: null };
  }

  const client: any = hc<ApiRoutes>("http://localhost:3000/", {
    headers: { Authorization: token },
  });

  const fetchRoot = async () => {
    try {
      setLoading(true);
      const response = await client.positions.root.$get();
      const data = await response.json();
      setTreeData(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch root positions");
    } finally {
      setLoading(false);
    }
  };

  const fetchChildren = async (parentId: string) => {
    try {
      setLoading(true);
      
      const response = await client.positions.children[parentId].$get();
      const data = await response.json();
      return Array.isArray(data) ? data : [];
      
    } catch (err: any) {
      setError(err.message || "Failed to fetch child positions");
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoot();
  }, []);

  return { treeData, fetchChildren, loading, error };
};