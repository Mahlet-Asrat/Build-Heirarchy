"use client";

import { useUpdatePosition } from "./useUpdate";

const UpdatePositionForm = ({ positionId }: { positionId: string | null }) => {
  
    const { register, handleSubmit, onSubmit, errors, success, serverError, validParents, loading} = useUpdatePosition(positionId);

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg">
      <h2 className="text-2xl font-bold text-center">Update Position</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
        <div>
          <label className="block font-medium">Position Name</label>
          <input
            type="text"
            {...register("name")}
            className="w-full p-2 border rounded-lg"
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <textarea
            {...register("description")}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block font-medium">Parent Position</label>

          <select {...register("parentId")} className="w-full p-2 border rounded-lg">

            <option value = ''> Select a parent position</option>

            {validParents.map((parent: any) => (

              <option key={parent.id} value={parent.id}>
                {parent.name}
              </option>
            ))}

          </select>
          {errors.parentId && <p className="text-red-500">{errors.parentId.message}</p>}
        </div>

        {serverError && <p className="text-center text-red-500">{serverError}</p>}


        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          {loading ? "Updating..." : "Update"}
        </button>

        {success && <p className="text-green-500 text-center">{success}</p>}
      </form>
    </div>
  );
};

export default UpdatePositionForm;
