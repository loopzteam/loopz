"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

export default function LoopzListPage() {
  const [loopz, setLoopz] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchLoopz();
  }, []);

  const fetchLoopz = async () => {
    const res = await fetch("/api/getloopz");
    const data = await res.json();
    setLoopz(data.loopz);
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setLoading(true);

    const res = await fetch("/api/generatetasks", {
      method: "POST",
      body: JSON.stringify({ input }),
    });

    let data = null;

    try {
      data = await res.json();
    } catch (e) {
      console.error("❌ Failed to parse JSON response:", e);
      alert("Something went wrong (no JSON returned). Check server logs.");
      setLoading(false);
      return;
    }

    if (data?.loopId) {
      setInput("");
      await fetchLoopz(); // refresh list
      router.push(`/loopz/${data.loopId}`);
    } else {
      alert(data?.error || "Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Open Loopz</h1>

      {loopz.length === 0 ? (
        <p>No loopz yet.</p>
      ) : (
        loopz.map((loop) => {
          const steps = loop.steps || [];
          const total = steps.length;
          const completed = steps.filter((s: any) => s.completed).length;
          const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

          return (
            <div
              key={loop.id}
              className="border p-4 rounded cursor-pointer mb-4"
              onClick={() => router.push(`/loopz/${loop.id}`)}
            >
              <h2 className="text-lg font-medium">{loop.title}</h2>
              <p className="text-sm text-gray-500">
                {format(new Date(loop.created_at), "MMM d")}
              </p>
              <div className="h-2 bg-gray-200 rounded mt-2">
                <div
                  className="h-full bg-indigo-500 rounded"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">{percent}% complete</p>
            </div>
          );
        })
      )}

      <div className="pt-6 mt-8 border-t border-gray-200">
        <h2 className="text-xl font-semibold mb-2">What’s on your mind?</h2>
        <textarea
          className="w-full p-4 rounded border border-gray-300"
          rows={3}
          placeholder="Enter your thought..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          {loading ? "Generating..." : "Get Clarity"}
        </button>
      </div>
    </div>
  );
}