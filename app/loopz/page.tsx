"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

// ShadCN UI components
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

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
      await fetchLoopz();
      router.push(`/loopz/${data.loopId}`);
    } else {
      alert(data?.error || "Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold mb-4">Open Loopz</h1>

      {loopz.length === 0 ? (
        <p className="text-muted-foreground">No loopz yet.</p>
      ) : (
        loopz.map((loop) => {
          const steps = loop.steps || [];
          const total = steps.length;
          const completed = steps.filter((s: any) => s.completed).length;
          const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

          return (
            <Card
              key={loop.id}
              className="cursor-pointer hover:shadow-md transition"
              onClick={() => router.push(`/loopz/${loop.id}`)}
            >
              <CardHeader>
                <CardTitle className="truncate">{loop.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground mb-2">
                  {format(new Date(loop.created_at), "MMM d")}
                </div>
                <Progress value={percent} className="mb-2" />
                <p className="text-sm text-muted-foreground">{percent}% complete</p>
              </CardContent>
            </Card>
          );
        })
      )}

      <div className="pt-6 mt-8 border-t border-border">
        <h2 className="text-xl font-semibold mb-2">What’s on your mind?</h2>
        <Textarea
          placeholder="Enter your thought..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-2"
        >
          {loading ? "Generating..." : "Get Clarity"}
        </Button>
      </div>
    </div>
  );
}