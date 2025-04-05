import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  const { data: loopz, error } = await supabase
    .from("loopz")
    .select("*")
    .limit(5); // example limit to keep output light

  if (error) return <div className="p-4 text-red-500">Supabase connection failed: {error.message}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Recent Loopz</h1>
      <ul className="space-y-2">
        {loopz?.map((loop: any) => (
          <li key={loop.id} className="border p-3 rounded">
            {loop.title}
          </li>
        ))}
      </ul>
    </div>
  );
}