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
  const p_limit = url.searchParams.get("p_limit");
  const p_page = url.searchParams.get("p_page");
  const p_order = url.searchParams.get("p_order");
  const p_search = url.searchParams.get("p_search");
  const p_type = url.searchParams.get("p_type");
  const p_internal_status = url.searchParams.get("p_internal_status");
  const path = url.pathname;
  const idMatch = path.match(/\/fetch_listed_properties\/([^/]+)/);
  const p_id = idMatch ? idMatch[1] : null;

  // Call the Supabase function with parameters
  const { data, error } = await supabaseClient.rpc("fetch_listed_properties", {
    p_id,
    p_limit,
    p_page,
    p_order,
    p_search,
    p_type,
    p_internal_status,
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  const totalRecords = data.paging.totalRecords;
  const page_offset = data.paging.currentOffset;
  const start = totalRecords > 0 ? page_offset + 1 : 0;
  const end = Math.min(start + data.paging.limit - 1, totalRecords);

  const pageText = `${start} - ${end} of ${totalRecords}`;

  const response = {
    ...data,
    paging: { ...data.paging, pageText },
    message: "Property Listings retrieved successfully",
  };

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
