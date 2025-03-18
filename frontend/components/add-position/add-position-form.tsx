import { useAddChildPosition } from "./useAddPositions";

const AddPositionForm = ({ parentId }: { parentId: string | null }) => {

  const { register, handleSubmit, onSubmit, errors, isSubmitting, serverError, success} = useAddChildPosition(parentId);

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg">
      <h2 className="text-2xl font-bold text-center">Add Child Position</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
        <div>
          <label className="block font-medium">Position Name</label>
          <input
            type="text"
            {...register("name")}
            className="w-full p-2 border rounded-lg"
            placeholder="Enter position name"
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <textarea
            {...register("description")}
            className="w-full p-2 border rounded-lg"
            placeholder="Enter description (optional)"
          />
        </div>

        {serverError && <p className="text-red-500 my-2">{serverError}</p>}

        <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
          {isSubmitting ? "Adding..." : "Add"}
        </button>

        {success && <p className="text-green-500">{success}</p>}
      </form>
    </div>
  );
};

export default AddPositionForm;
