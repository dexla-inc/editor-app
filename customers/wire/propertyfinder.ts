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
  const { data, error } = await supabaseClient.rpc("get_property_listings");

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
      reference_number: item.reference_number,
      permit_number: item.permit_number,
      dtcm_permit: item.dtcm_permit,
      offering_type: propertyPurposeTypes[item.property_purpose],
      property_type: property_types[item.property_type],
      price_on_application: item.include_price,
      price: item.rental_pricing ?? item.price,
      service_charge: item.service_charge,
      cheques: item.annual_cheques,
      city: item.city,
      community: item.community,
      sub_community: item.sub_community,
      property_name: item.property_name,
      title_en: item.title_en,
      title_ar: item.title_ar,
      description_en: item.description_en,
      description_ar: item.description_ar,
      private_amenities: item.private_amenities,
      commercial_amenities: item.commercial_amenities,
      plot_size: item.land_size,
      size: item.property_size,
      bedroom: item.bedroom,
      bathroom: item.bathroom,
      agent: {
        id: item.agents_id,
        name: item.agents_name,
        email: item.agents_email,
        phone: item.agents_phone,
        photo: item.agents_photo_url,
        license_no: item.agents_license_no,
        info: item.agents_info,
      },
      build_year: item.build_year,
      floor: item.floor,
      stories: item.stories,
      parking: item.parking,
      furnished: item.furnished,
      view360: item.view360,
      photo: item.photos,
      floor_plan: item.floor_plans,
      geopoints: item.lng_lat,
      title_deed: item.title_deed,
      availability_date: item.availability_date,
      video_tour_url: item.video_tour,
      developer: item.developer,
      project_name: item.project_name,
      completion_status: item.completion_status,
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

const propertyPurposeTypes = {
  "Residential Rent": "RR",
  "Residential Sale": "RS",
  "Commercial Rent": "CR",
  "Commercial Sale": "CS",
};

const property_types = {
  "Apartment/Flat": "AP",
  "Bulk Units": "BU",
  Bungalow: "BW",
  "Business Centre": "BC",
  Compound: "CD",
  "Co-working Space": "CW",
  Duplex: "DX",
  Factory: "FA",
  Farm: "FM",
  "Full Floor": "FF",
  "Half Floor": "HF",
  "Hotel Apartment": "HA",
  "Labor Camp": "LC",
  "Land/Plot": "LP",
  "Office Space": "OF",
  Penthouse: "PH",
  Retail: "RE",
  Restaurant: "RT",
  Shop: "SH",
  Showroom: "SR",
  "Staff Accommodation": "SA",
  Storage: "ST",
  Townhouse: "TH",
  "Villa/House": "VH",
  Warehouse: "WH",
  "Whole Building": "WB",
};
