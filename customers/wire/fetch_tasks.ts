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
  const idMatch = path.match(/\/fetch_tasks\/([^/]+)/);
  const p_id = idMatch ? idMatch[1] : null;

  // Extract query parameters
  const p_limit = url.searchParams.get("limit");
  const p_page = url.searchParams.get("page");
  const p_order = url.searchParams.get("order");
  const p_search = url.searchParams.get("search");

  // Call the Supabase function with parameters
  const { data, error } = await supabaseClient.rpc("fetch_tasks", {
    p_id,
    p_limit,
    p_page,
    p_order,
    p_search,
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  let response = {
    data: data.result,
    message: "Tasks retrieved successfully",
  };

  // Include pagination info if p_limit and p_page are provided
  if (p_limit && p_page) {
    const limit = parseInt(p_limit, 10);
    const currentPage = parseInt(p_page, 10);
    const prevPage = currentPage > 1 ? currentPage - 1 : currentPage;
    const nextPage = data.totalCount === limit ? currentPage + 1 : currentPage;
    const page_offset = (currentPage - 1) * limit;
    const start = data.totalCount > 0 ? page_offset + 1 : 0;
    const end = Math.min(start + limit - 1, data.totalCount);

    const pageText = `${start} - ${end} of ${data.totalCount}`;

    // @ts-ignore
    response.pagination = {
      prevPage,
      currentPage,
      nextPage,
      totalPages: data.totalPages,
      pageText,
    };
  }

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
