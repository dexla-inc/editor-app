// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// @ts-ignore
Deno.serve(async (req: Request) => {
  const supabaseClient = createClient(
    // @ts-ignore
    Deno.env.get("SUPABASE_URL") ?? "",
    // @ts-ignore
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    {
      global: { headers: { Authorization: req.headers.get("Authorization")! } },
    },
  );

  const {
    property_id,
    description = null,
    date = null,
    task_time = null,
    type = "notes",
    contact_id = null,
    agent_id = null,
  } = await req.json();

  const defaultQuery = { description, date, task_time, type, property_id };
  const query =
    type === "notes"
      ? defaultQuery
      : type === "call"
        ? { ...defaultQuery, agent_id }
        : { ...defaultQuery, contact_id, agent_id };

  // Database queries will have RLS policies enforced
  const { data, error } = await supabaseClient.rpc("insert_task", {
    ...query,
  });

  if (!property_id) {
    return new Response(JSON.stringify({ error: "property_id is required" }), {
      status: 400,
    });
  }

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  const response = {
    message: "Task inserted successfully",
    data,
  };

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
