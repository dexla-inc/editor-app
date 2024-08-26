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
  const complete = url.searchParams.get("complete");
  const startDate = url.searchParams.get("start_date");
  const endDate = url.searchParams.get("end_date");
  const offset = parseInt(url.searchParams.get("offset") ?? "0");
  const limit = parseInt(url.searchParams.get("limit") ?? "10");

  if (!type) {
    return new Response(
      JSON.stringify({ error: "Type parameter is required" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const params: {
    p_contact_type: string;
    p_is_completed?: boolean;
    p_start_date?: string;
    p_end_date?: string;
    p_offset: number;
    p_limit: number;
  } = {
    p_contact_type: type,
    p_offset: offset,
    p_limit: limit,
  };

  if (complete) params.p_is_completed = complete === "true";
  if (startDate) params.p_start_date = startDate;
  if (endDate) params.p_end_date = endDate;

  const { data, error } = await supabaseClient.rpc(
    "get_contacts_to_call_reminders",
    params,
  );

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  const totalRecords = data[0]?.total_count ?? 0;
  const results = data.map((item: any) => ({
    task_id: item.task_id,
    property_listing_id: item.property_listing_id,
    contact_id: item.contact_id,
    contact_name: item.contact_name,
    contact_phone: item.contact_phone,
    contact_email: item.contact_email,
    task_datetime: item.task_datetime,
    task_description: item.task_description,
    task_is_completed: item.task_is_completed,
  }));

  const response = {
    results,
    paging: {
      totalRecords,
      recordsPerPage: limit,
      page: Math.floor(offset / limit) + 1,
      complete: complete || "false",
    },
  };

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
