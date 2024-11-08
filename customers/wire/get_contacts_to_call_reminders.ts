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
  const complete = url.searchParams.get("complete");
  const startDate = url.searchParams.get("start_date");
  const endDate = url.searchParams.get("end_date");
  const offset = parseInt(url.searchParams.get("offset") ?? "0");
  const limit = parseInt(url.searchParams.get("limit") ?? "50");

  const params: {
    p_is_completed?: boolean;
    p_start_date?: string;
    p_end_date?: string;
    p_offset: number;
    p_limit: number;
  } = {
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

  function getGroupedContacts(data: any[]) {
    const groupedResults = data.reduce(
      (acc: { [key: string]: any[] }, item: any) => {
        const { contact_type, ...rest } = item;
        const contactType = contact_type;

        if (!acc[contactType]) {
          acc[contactType] = [];
        }

        acc[contactType].push(item);

        return acc;
      },
      {},
    );

    return groupedResults;
  }

  const results = getGroupedContacts(data);

  const response = {
    results,
    paging: {
      totalRecords: data.length,
      recordsPerPage: limit,
      page: Math.floor(offset / limit) + 1,
    },
  };

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
