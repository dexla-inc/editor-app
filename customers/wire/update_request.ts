// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// @ts-ignore
Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabaseClient = createClient(
    // @ts-ignore
    Deno.env.get("SUPABASE_URL") ?? "",
    // @ts-ignore
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    {
      global: { headers: { Authorization: req.headers.get("Authorization")! } },
    },
  );

  try {
    const { request_id, id, status } = await req.json();

    if (!request_id || !id || !status) {
      return new Response("Missing required parameters", {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { data, error } = await supabaseClient.rpc(
      "update_agent_request_status",
      {
        p_request_id: request_id,
        p_listing_id: id,
        p_request_status: status,
      },
    );

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify((error as Error).message), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
