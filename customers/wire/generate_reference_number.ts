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

  const url = new URL(req.url);
  const type = url.searchParams.get("type");

  if (!type) {
    return new Response(
      JSON.stringify({ error: "Type parameter is required" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  // Database queries will have RLS policies enforced
  const { data, error } = await supabaseClient.rpc(
    "generate_reference_number",
    { type },
  );

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(
    JSON.stringify({
      ref_number: data,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
});
