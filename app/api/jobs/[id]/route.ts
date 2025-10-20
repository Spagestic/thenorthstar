import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: job, error } = await supabase
      .from("job_positions")
      .select(
        `
        id,
        title,
        category,
        seniority_level,
        typical_requirements,
        typical_responsibilities,
        company:companies(name)
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error("Error fetching job:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
