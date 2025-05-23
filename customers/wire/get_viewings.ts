// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req: Request) => {
  const supabaseClient = createClient(
    // @ts-ignore
    Deno.env.get("SUPABASE_URL") ?? "",
    // @ts-ignore
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    {
      global: { headers: { Authorization: req.headers.get("Authorization")! } },
    },
  );

  // Get the id from the URL path
  const url = new URL(req.url);
  const pathSegments = url.pathname
    .split("/")
    .filter((segment) => segment !== "");
  const filter_id = pathSegments[pathSegments.length - 1];

  // Get the filter_type from the search parameters
  const filter_type = url.searchParams.get("type") || "today";

  // Check if filter_id is falsey
  if (!filter_id) {
    return new Response(JSON.stringify({ error: "ID is required" }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }

  // Call the RPC function
  const { data, error } = await supabaseClient.rpc("get_viewings", {
    filter_id,
    filter_type,
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
});
