// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// @ts-ignore
Deno.serve(async (req: Request) => {
  const supabaseClient = createClient(
    // @ts-ignore
    Deno.env.get("SUPABASE_URL") ?? "",
    // @ts-ignore
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
  );

  // Parse the URL and extract query parameters
  const url = new URL(req.url);
  const path = url.pathname;
  const idMatch = path.match(/\/get_brochure\/([^/]+)/);
  const listing_id = idMatch ? idMatch[1] : null;

  if (!listing_id) {
    return new Response(JSON.stringify({ error: "Property ID is required" }), {
      status: 400,
    });
  }

  // Call the Supabase function with parameters
  const { data, error } = await supabaseClient.rpc("get_brochure_features", {
    listing_id,
  });

  if (!data) {
    return new Response(
      JSON.stringify({ error: "Property cannot be found." }),
      { status: 404 },
    );
  }

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  const response = {
    ...data,
    message: "Brochure retrieved successfully",
  };

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
