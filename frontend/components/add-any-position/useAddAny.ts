// In your useAddAnyPos hook:
import { useState, useEffect } from "react";
import { hc } from "hono/client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiRoutes } from "../../../../position_management/src/app";


const addChildSchema = z.object({
    name: z.string().min(1, "Please Enter a name"),
    description: z.string().optional(),
    parentId: z.string()
})

type AddChildSchema = z.infer<typeof addChildSchema>

export const useAddAnyPos = () => {
    const [success, setSuccess] = useState('');
    const [serverError, setServerError] = useState('');
    const [validParents, setValidParents] = useState<any[]>([]); 
    const [isLoading, setIsLoading] = useState(true); 

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AddChildSchema>({
        resolver: zodResolver(addChildSchema),
    });

    useEffect(() => {
        const fetchParents = async () => {
            try {

                const token = localStorage.getItem("token");
                if (!token) {

                    setServerError("Unauthorized: Please login first");
                    setIsLoading(false);
                    return;
                }

                const client: any = hc<ApiRoutes>("http://localhost:3000/", {
                    headers: { Authorization: token },
                });

                const response = await client.positions.all.$get();
                if (!response.ok) {

                    setServerError("Failed to fetch parents");
                    setIsLoading(false);
                    return;
                }

                const parents = await response.json();
                setValidParents(parents);

            } catch (error) {

                setServerError("Failed to fetch parents");

            } finally {
                setIsLoading(false);
            }
        };

        fetchParents();
    }, []);

    const onSubmit = async (data: AddChildSchema) => {

        const parentId = data.parentId === '' ? null : data.parentId
        const updatedData = {...data, parentId}

        setServerError('');
        setSuccess('');
        

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                setServerError("Unauthorized: Please login first");
                return;
            }

            const client: any = hc<ApiRoutes>("http://localhost:3000/", {
                headers: { Authorization: token },
            });

            const res = await client.positions.$post({
                json: updatedData,
            });

            if (!res.ok) {
                const result = await res.json();
                setServerError(result.error || result.validationErrors || "Failed to add a child position");
                return;
            }

            setSuccess("Child position added successfully!");
        } catch (error) {
            setServerError("Please try again");
        }
    };

    return { register,handleSubmit, onSubmit,errors,isSubmitting,serverError,success,validParents, isLoading};

};
