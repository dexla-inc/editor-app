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

  // Parse the URL to extract the ID
  const url = new URL(req.url);
  const path = url.pathname;
  const idMatch = path.match(/\/fetch_contents\/([^/]+)/);
  const p_id = idMatch ? idMatch[1] : null;

  // Extract query parameters
  const p_limit = url.searchParams.get("limit");
  const p_page = url.searchParams.get("page");
  const p_order = url.searchParams.get("order");
  const p_search = url.searchParams.get("search");
  const p_category = url.searchParams.get("category");

  // Call the Supabase function with parameters
  const { data, error } = await supabaseClient.rpc(
    "fetch_user_content_progress",
    {
      p_id,
      p_limit,
      p_page,
      p_order,
      p_search,
      p_category,
    },
  );

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  let response = {
    data: data.result,
    message: "Contents retrieved successfully",
    pagination: {},
  };

  // Include pagination info if p_limit and p_page are provided
  if (p_limit && p_page) {
    const limit = parseInt(p_limit, 10);
    const currentPage = parseInt(p_page, 10);
    const prevPage = currentPage > 1 ? currentPage - 1 : currentPage;
    const nextPage = data.length === limit ? currentPage + 1 : currentPage;

    response.pagination = {
      prevPage,
      currentPage,
      nextPage,
      totalPages: data.totalPages,
      limit,
    };
  }

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
