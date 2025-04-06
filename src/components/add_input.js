import { useState } from "react";

export default function AddInput() {
  const [entering, setEntering] = useState(false);

  const btnStyle = entering
    ? "w-fit px-5 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
    : "w-fit px-5 py-3 bg-yellow-500 text-white rounded-md hover:bg-yellow-600";

  return (
    <div className="flex justify-center flex-col gap-5 mt-6">
      <div className={entering ? "block" : "hidden"}>
        <label className="block text-lg font-medium text-gray-700">
          New Event
        </label>
        <input
          placeholder="Describe your bucket list event..."
          type="text"
          className="block w-full p-3 border rounded-md"
        />
      </div>
      <div className="flex justify-center">
        <button
          onClick={() => setEntering(!entering)}
          id="add-button"
          className={btnStyle}
        >
          {entering ? "Save" : "Add"}
        </button>
      </div>
    </div>
  );
}
