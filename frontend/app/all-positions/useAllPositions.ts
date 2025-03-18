"use client";

import { hc } from "hono/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ApiRoutes } from "../../../../position_management/src/app";

export const useAllPositions = () => {

  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const [positions, setPositions] = useState<{ id: string; name: string; description: string; parentId: string | null }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const fetchPositions = async () => {

    setError("");
    setLoading(true);

    try {

      const token = localStorage.getItem("token");

      if (!token) {

        setError("Unauthorized: Please login first");
        setLoading(false);
        return;
      }

      const client: any = hc<ApiRoutes>("http://localhost:3000/", {
        headers: { Authorization: token },
      });
      
      console.log("Iam here")

      
      const data = await client.positions.$get({ query: { page: currentPage } });

      const knowPage = await client.positions.all.$get();

      const toPage = await knowPage.json()


      const res = await data.json()
      console.log("Res",res)

      if (!res.positions.length || !Array.isArray(res.positions)) {

        setError("Invalid response from server");

        return;
      }

      const total = Number(toPage.length) || 0;
      const limit = Number(res.limit) || 6;
      const pages = Math.ceil(total / limit);

      if (currentPage > pages && pages > 0) {

        router.push("/all-positions?page=1");
        return;
      }

      setTotalPages(pages > 0 ? pages : 1);
      setPositions(res.positions);

    } catch (error) {

      console.error("Error fetching positions:", error);
      setError("Server error. Please try again later.");

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchPositions();

  }, [searchParams.get("page")]); 

  return { positions, loading, error, totalPages, currentPage };
};
