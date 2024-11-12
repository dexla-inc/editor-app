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

  // Parse the URL and extract query parameters
  const url = new URL(req.url);
  const p_limit = url.searchParams.get("limit");
  const p_page = url.searchParams.get("page");
  const p_order = url.searchParams.get("order");
  const p_search = url.searchParams.get("search");
  const p_status = url.searchParams.get("status");
  const p_id = url.searchParams.get("id");

  // Call the Supabase function with parameters
  const { data, error } = await supabaseClient.rpc("new_request", {
    p_id,
    p_limit,
    p_page,
    p_order,
    p_search,
    p_status,
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
