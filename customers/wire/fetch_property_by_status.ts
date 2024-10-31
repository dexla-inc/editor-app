// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

function getKeyValuePair(str: RegExpMatchArray | null) {
  const match = str?.[1] || "";
  const status = {
    live: "live",
    market: "coming_to_market",
    prospect: "prospect",
    withdrawn: "withdrawn",
    sold: "sold",
  };
  const isStatusType = Object.keys(status).includes(match);
  return { status: status[match as keyof typeof status] || null, isStatusType };
}

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
  const action = url.searchParams.get("action");
  const path = url.pathname;
  const idMatch = path.match(/\/fetch_property_by_status\/([^/]+)/);
  const { status, isStatusType } = getKeyValuePair(idMatch);

  if (!isStatusType) {
    return new Response(
      JSON.stringify({
        error:
          "Invalid status type. Must be either live, market, prospect, withdrawn or sold.",
      }),
      { status: 400 },
    );
  }

  const [_, limit = 6] = action?.split("_") || [];
  // Call the Supabase function with parameters
  const {
    data: { result, paging },
    error,
  } = await supabaseClient.rpc("fetch_listed_properties", {
    p_limit: limit,
    p_order: "property_name.asc",
    p_internal_status: status,
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  const buttonActions = {
    title: paging.totalRecords > Number(limit) ? "View All" : "View Less",
    action:
      paging.totalRecords > Number(limit)
        ? `view_${paging.totalRecords}`
        : "view_6",
    showButton: paging.totalRecords > 6,
  };

  const response = {
    result,
    buttonActions,
    success: "Property Listings retrieved successfully",
    error: "",
  };

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
