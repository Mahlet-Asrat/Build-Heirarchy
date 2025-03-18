import { useState } from "react";

export const useSearch = () => {

    const [searchQuery, setSearchQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSearch = async () => {

        setLoading(true);
        setError("");

        try {

            if (!searchQuery.trim()) {
                setError("");
                setLoading(false);
                return;
            }

            const token = localStorage.getItem("token");

            if (!token) {
                setError("Unauthorized: Please login first.");
                setLoading(false);
                return;
            }

            const response = await fetch(`http://localhost:3000/positions/search?q=${searchQuery}`, {
                headers: { Authorization: token },
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.message || "Failed to fetch results.");
                setResults([]);
                setLoading(false);
                return;
            }

            if (!Array.isArray(result)) {
                setError(result.message);
                setResults([]);
                return;
            }

            setResults(result);

        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally{
            setLoading(false);
        }
    };

    return { searchQuery, setSearchQuery, results, loading, error, handleSearch };
};
