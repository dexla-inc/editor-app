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

  // Parse the request body
  const { id } = await req.json();

  // Check if id is null, undefined, or an empty string
  if (id === null || id === undefined || id === "") {
    return new Response(
      JSON.stringify({ error: "Invalid or missing id parameter" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  // Call the RPC function
  const { data, error } = await supabaseClient.rpc(
    "duplicate_property_listing",
    {
      p_id: id,
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
});
