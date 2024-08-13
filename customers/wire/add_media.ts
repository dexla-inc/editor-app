// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// @ts-ignore
Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
    });
  }

  const supabaseClient = createClient(
    // @ts-ignore
    Deno.env.get("SUPABASE_URL") ?? "",
    // @ts-ignore
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    {
      global: { headers: { Authorization: req.headers.get("Authorization")! } },
    },
  );

  // Parse the request body
  const { data, property_id } = await req.json();

  if (!Array.isArray(data) || data.length === 0 || !property_id) {
    return new Response(
      JSON.stringify({
        error: "Invalid or empty data array, or missing property_id",
      }),
      { status: 400 },
    );
  }
  const requestData = data.map(({ is_main, ...rest }) => ({
    ...rest,
    property_listing_id: property_id,
  }));

  // Insert multiple media entries into the media table
  const { data: mediaData, error: mediaError } = await supabaseClient
    .from("media")
    .insert(requestData)
    .select();

  if (mediaError) {
    return new Response(JSON.stringify({ error: mediaError.message }), {
      status: 500,
    });
  }

  // Find the main photo ID
  const mainPhotoData = mediaData.find(
    (media: Record<string, any>, index: number) => data[index].is_main === true,
  );
  const mainPhotoId = mainPhotoData ? mainPhotoData.id : null;

  if (mainPhotoId) {
    // Update the property_listings table with the main photo ID
    const { error: updateError } = await supabaseClient
      .from("property_listings")
      .update({ main_photo: mainPhotoId })
      .eq("id", property_id);

    if (updateError) {
      console.error("Failed to update property listing:", updateError);
      // Note: We're not returning here, as we still want to return the media data
    }
  }

  const response = {
    data: mediaData,
    message: "Media added successfully and property listing updated.",
    main_photo_id: mainPhotoId,
  };

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
