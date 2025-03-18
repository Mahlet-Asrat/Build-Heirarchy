"use client";

import { createContext, useState, useEffect, useContext } from "react";

interface Company {
  name: string;
  email: string;
  description: string;
}


export const useCompanyInfo = () => {

  const [company, setCompany] = useState<Company | null>(null);

  useEffect(() => {

    const fetchCompanyInfo = async () => {

      const token = localStorage.getItem("token");

      if (!token) return;

      try {
        const res = await fetch("http://localhost:3000/company-info", {
          headers: { Authorization: token },
        });

        if (!res.ok) throw new Error("Failed to fetch company info");
        const data = await res.json();
        setCompany(data.company);
      } catch (error) {

        console.error("Error fetching company info:", error);

      }
    };

    fetchCompanyInfo()

  }, []);

  return {company};
};

// export const useCompany = () => useContext(CompanyContext);
