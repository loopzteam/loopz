import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface TaskItem {
  title: string;
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Get input from form submission
    const formData = await req.formData();
    const input = formData.get("input")?.toString() ?? "";
    console.log("Received input:", input);

    if (!input || typeof input !== "string") {
      return NextResponse.json(
        { error: "Input is required and must be a string" },
        { status: 400 }
      );
    }

    // Step 1: Call OpenAI to generate tasks
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      temperature: 0,
      messages: [
        {
          role: "system",
          content: `
Generate tasks based on the user's input. Your response must be ONLY a JSON array of task objects.
Example response format:
[
  { "title": "First task" },
  { "title": "Second task" },
  { "title": "Third task" }
]
          `.trim(),
        },
        { role: "user", content: input },
      ],
    });

    const rawResponse = completion.choices[0]?.message.content || "[]";
    console.log("Raw GPT output:", rawResponse);

    // Parse the response
    let steps: TaskItem[] = [];
    try {
      const jsonMatch = rawResponse.match(/\[[\s\S]*\]/);
      const jsonStr = jsonMatch ? jsonMatch[0] : rawResponse;
      const parsedResponse = JSON.parse(jsonStr);

      if (Array.isArray(parsedResponse)) {
        steps = parsedResponse.filter(
          (item) =>
            typeof item === "object" &&
            item !== null &&
            "title" in item &&
            typeof item.title === "string"
        );
      }
      console.log("Parsed steps:", steps);
    } catch (err) {
      console.error("Failed to parse JSON:", err);
    }

    if (steps.length === 0) {
      steps = [
        { title: "Review requirements" },
        { title: "Create initial draft" },
        { title: "Finalize implementation" },
      ];
      console.log("Using default steps");
    }

    // Step 2: Insert the Loop into Supabase
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error("User fetch error:", userError)
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
    }

    const { data: loop, error: loopError } = await supabase
      .from("loopz")
      .insert([{ title: input, user_id: user.id }])
      .select()
      .single();

    if (loopError) {
      console.error("Loop insert error:", loopError);
      return NextResponse.json(
        { error: loopError?.message || "Loop creation failed" },
        { status: 500 }
      );
    }

    // Step 3: Insert the Steps into Supabase
    const stepPayload = steps.map((s) => ({
      loop_id: loop.id,
      title: s.title,
      completed: false,
    }));

    const { error: stepError } = await supabase
      .from("steps")
      .insert(stepPayload);

    if (stepError) {
      console.error("Step insert error:", stepError);
      return NextResponse.json({ error: stepError.message }, { status: 500 });
    }

    console.log("Steps inserted successfully");
    const baseUrl = req.nextUrl.origin;
    return NextResponse.redirect(`${baseUrl}/loopz/${loop.id}`, { status: 303 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}