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

  // Extract query parameters
  const url = new URL(req.url);
  const p_id = url.searchParams.get("id") ?? null;
  const p_limit = url.searchParams.get("limit") ?? null;
  const p_page = url.searchParams.get("page") ?? "1";
  const p_order = url.searchParams.get("order") || "";
  const p_search = url.searchParams.get("search") ?? "";

  // Database queries will have RLS policies enforced
  const { data, error } = await supabaseClient.rpc("fetch_sellers", {
    p_limit,
    p_page,
    p_order,
    p_search,
    p_id,
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
