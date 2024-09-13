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
  const startDate = url.searchParams.get("start_date");
  const endDate = url.searchParams.get("end_date");

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
    p_start_date?: string;
    p_end_date?: string;
  } = {
    p_contact_type: type,
  };

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

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
