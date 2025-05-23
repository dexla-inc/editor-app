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
  const type = url.searchParams.get("type");

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
  let { data, error } = await supabaseClient.rpc("search_contact", {
    query,
    type,
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  data = data.map((item: any) => ({
    ...item,
    requestKey: `${item.table_name}_${item.record_id},${item.lead_no}_${item.property_listing_id}`,
  }));

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
