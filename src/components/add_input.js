import { useState } from "react";

export default function AddInput({
  setParsedList,
  parsedList,
  setBucketList,
  setError,
  setLoading,
}) {
  const [entering, setEntering] = useState(false);
  const [userInfo, setUserInfo] = useState({ description: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    //console.log(JSON.stringify(userInfo));
    try {
      const response = await fetch("/api/manual", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description: userInfo.description }),
      });

      const data = await response.json();
      const bucketItems = data.tFormatted;

      if (response.ok) {
        //var bucketItems = parseBucketItems(data.bucketList);
        bucketItems.map((item, index) => {
          //console.log(`Item ${index + 1}:`);
          Object.entries(item).forEach(([key, value]) => {
            //console.log(`  ${key}: ${value}`);
          });
        });
        setParsedList((prevList) => [...(prevList || []), bucketItems[0]]);
      } else {
        setError(
          data.error || "An error occurred while generating the bucket list."
        );
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("An error occurred while generating the bucket list.");
    }

    setLoading(false);
  };

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
          value={userInfo.description}
          onChange={(e) =>
            setUserInfo((prev) => ({ ...prev, description: e.target.value }))
          }
        />
      </div>
      <div className="flex justify-center">
        <button
          onClick={entering ? handleSubmit : () => setEntering(true)}
          id="add-button"
          className={btnStyle}
        >
          {entering ? "Save" : "Add"}
        </button>
      </div>
    </div>
  );
}
