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
  const leadNo = url.searchParams.get("p_lead_no");
  const salesType = url.searchParams.get("p_sales_type") ?? "sales";
  const offset = parseInt(url.searchParams.get("offset") ?? "0");
  const limit = parseInt(url.searchParams.get("limit") ?? "10");

  if (!leadNo) {
    return new Response(
      JSON.stringify({ error: "Lead number parameter is required" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const params: {
    p_lead_no: string;
    p_sales_type: string;
    p_offset: number;
    p_limit: number;
  } = {
    p_lead_no: leadNo,
    p_sales_type: salesType,
    p_offset: offset,
    p_limit: limit,
  };

  const { data, error } = await supabaseClient.rpc(
    "match_leads_to_properties",
    params,
  );

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  const totalRecords = data[0]?.total_count ?? 0;
  const results = data.map(({ total_count, ...rest }: any) => ({
    ...rest,
  }));

  const response = {
    results,
    paging: {
      totalRecords,
      recordsPerPage: limit,
      page: Math.floor(offset / limit) + 1,
    },
  };

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
