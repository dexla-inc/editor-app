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

  // Database queries will have RLS policies enforced
  const { data, error } = await supabaseClient.from("rental_units").select("*");

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  let mostRecentUpdate = new Date(0);
  const transformedProperties = data.map((item: any) => {
    const lastUpdateDate = new Date(item.last_updated);
    if (lastUpdateDate > mostRecentUpdate) {
      mostRecentUpdate = lastUpdateDate;
    }

    return {
      $: {
        last_update: item.last_updated,
      },
      reference_number: item.id,
      offering_type: item.offering_type,
      property_type: item.property_type,
      permit_number: item.permit_number,
      dtcm_permit: item.dtcm_permit,
      emirate: item.emirate,
      district: item.district,
      project: item.community,
      building_name: item.building_name,
      city: item.city,
      community: item.community,
      sub_community: item.sub_community,
      property_name: item.property,
      title_en: "Marketing Heading in English",
      title_ar: "Marketing Heading in Arabic",
      description_en: "Additional details in English",
      description_ar: "Additional details in Arabic",
      private_amenities: ["AC", "BA", "BK", "BL"],
      service_charge: 5000,
      cheques: 4,
      price: {
        yearly: 100000,
        monthly: 12000,
        weekly: 3000,
        daily: 500,
      },
      commercial_amenities: ["CR", "AN", "DN", "LB"],
      plot_size: 5000,
      bedroom: item.bedroom,
      bathroom: 2,
      build_year: 2010,
      floor: 5,
      agent: {
        id: "agent123",
        name: "Agent Name",
        email: "agent@example.com",
        phone: "1234567890",
        photo: "http://example.com/photo.jpg",
        license_no: "RERA123",
        info: "Agent Info",
      },
      size: 1200,
      stories: 2,
      parking: 1,
      photo: [
        {
          url: "http://example.com/photo1.jpg",
          last_updated: "2017-12-25 14:15:16",
        },
        {
          url: "http://example.com/photo2.jpg",
          last_updated: "2017-12-25 14:15:16",
        },
      ],
      floor_plan: [
        {
          url: "http://example.com/floorplan1.jpg",
          last_updated: "2017-12-25 14:15:16",
        },
      ],
      geopoints: {
        longitude: 55.27411,
        latitude: 25.197477,
      },
      furnished: "Yes",
      view360: "http://example.com/360view",
      title_deed: "123456/2022",
      availability_date: "2022-04-13T00:00:00Z",
      video_tour_url: "http://example.com/video_tour",
      project_name: "Project Name",
      completion_status: "completed",
      developer: "Developer Name",
    };
  });

  const transformedData = {
    list: {
      $: {
        last_update: mostRecentUpdate.toISOString(),
        listing_count: data.length,
      },
      property: transformedProperties,
    },
  };

  return new Response(JSON.stringify(transformedData), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
