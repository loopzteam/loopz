// app/loopz/[id]/page.tsx

import { supabase } from "@/lib/supabase";

export default async function LoopzDetailPage({ params }: { params: { id: string } }) {

  const { data: loop, error } = await supabase
    .from('loopz')
    .select('*, steps(*, microsteps(*))')
    .eq('id', params.id)
    .maybeSingle(); // <-- changed from .single() to .maybeSingle()

  if (error) {
    return <div className="p-8">Error loading loop: {error.message}</div>;
  }

  if (!loop) {
    return <div className="p-8">No loop found for ID {params.id}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold">Loop Title: {loop.title}</h1>
      <p>{loop.description}</p>
      <pre>{JSON.stringify(loop, null, 2)}</pre>
    </div>
  );
}