import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      },
    );

    const url = new URL(req.url);
    const jobId = url.searchParams.get("jobId");
    const method = req.method;

    // GET: Retrieve progress for a specific job
    if (method === "GET" && jobId) {
      const { data, error } = await supabaseClient
        .from("scraping_jobs")
        .select("*")
        .eq("id", jobId)
        .single();

      if (error) throw error;

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // POST: Create a new scraping job
    if (method === "POST") {
      const body = await req.json();
      const { url: targetUrl, initialSteps } = body;

      const {
        data: { user },
      } = await supabaseClient.auth.getUser();

      if (!user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data, error } = await supabaseClient
        .from("scraping_jobs")
        .insert({
          user_id: user.id,
          url: targetUrl,
          status: "pending",
          steps: initialSteps || [],
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 201,
      });
    }

    // PATCH: Update job progress
    if (method === "PATCH" && jobId) {
      const body = await req.json();
      const {
        status,
        currentStepId,
        steps,
        jobsFound,
        errorMessage,
        companyMetadata,
      } = body;

      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (status) updateData.status = status;
      if (currentStepId) updateData.current_step_id = currentStepId;
      if (steps) updateData.steps = steps;
      if (jobsFound !== undefined) updateData.jobs_found = jobsFound;
      if (errorMessage) updateData.error_message = errorMessage;
      if (companyMetadata) updateData.company_metadata = companyMetadata;

      const { data, error } = await supabaseClient
        .from("scraping_jobs")
        .update(updateData)
        .eq("id", jobId)
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
