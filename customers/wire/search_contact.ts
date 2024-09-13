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
  const query = url.searchParams.get("query");
  const path = url.pathname;
  const typeMatch = path.match(/\/search_contact\/([^/]+)/);
  const type = typeMatch ? typeMatch[1] : null;

  if (!query) {
    return new Response(
      JSON.stringify({ error: "Search parameter is required" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  // Database queries will have RLS policies enforced
  const { data, error } = await supabaseClient.rpc("search_contact", {
    query,
    type,
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
