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

  const {
    first_name: p_first_name,
    surname: p_surname,
    phone_number: p_phone_number,
    email: p_email,
    contact_type: p_contact_type,
  } = await req.json();

  if (!p_first_name) {
    return new Response(JSON.stringify({ error: "First name is required" }), {
      status: 400,
    });
  }
  if (!p_surname) {
    return new Response(JSON.stringify({ error: "Last name is required" }), {
      status: 400,
    });
  }
  if (!p_phone_number) {
    return new Response(JSON.stringify({ error: "Phone number is required" }), {
      status: 400,
    });
  }
  if (!p_email) {
    return new Response(JSON.stringify({ error: "Email is required" }), {
      status: 400,
    });
  }
  if (!p_email.includes("@")) {
    return new Response(JSON.stringify({ error: "Invalid email address" }), {
      status: 400,
    });
  }
  if (!p_contact_type || !["buyer", "seller"].includes(p_contact_type)) {
    return new Response(
      JSON.stringify({
        error: 'Invalid contact type. Must be either "buyer" or "seller".',
      }),
      {
        status: 400,
      },
    );
  }
  // Database queries will have RLS policies enforced
  const { error } = await supabaseClient.rpc("add_contact", {
    p_first_name,
    p_surname,
    p_phone_number,
    p_email,
    p_contact_type,
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  const response = {
    message: "Contact added successfully",
  };

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
