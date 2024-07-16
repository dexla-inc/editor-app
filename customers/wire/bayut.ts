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
      Property_Ref_No: item.reference_number,
      Permit_Number: item.permit_number,
      Property_Status: item.property_status,
      Property_purpose: item.offering_type,
      Property_Type: item.property_type,
      Property_Size: item.property_size,
      Property_Size_Unit: item.property_size_unit,
      plotArea: item.land_size,
      Bedrooms: item.bedroom,
      Bathrooms: item.bathroom,
      Features: item.private_amenities,
      Off_plan: item.completion_status === "off_plan" ? "Yes" : "No",
      Portals: {
        Portal: item.platforms
          ?.split(",")
          .filter((m) => ["Bayut", "dubizzle"].includes(m))
          .map((portal: string) => portal.trim()),
      },
      Last_Updated: item.last_updated,
      Property_Title: item.title_en,
      Property_Description: item.description_en,
      Property_Title_AR: item.title_ar,
      Property_Description_AR: item.description_ar,
      Price: item.price,
      Rent_Frequency: item.rent_frequency,
      Furnished: item.furnished,
      offplanDetails_saleType: item.offplan_sale_type,
      offplanDetails_dldWaiver: item.offplan_dld_waiver,
      offplanDetails_originalPrice: item.offplan_original_price,
      offplanDetails_amountPaid: item.offplan_amount_paid,
      Images: item.photos,
      Videos: item.videos,
      City: item.city,
      Locality: item.community,
      Sub_Locality: item.sub_community,
      Tower_Name: item.property_name,
      Listing_Agent: item.agents_name,
      Listing_Agent_Phone: item.agents_phone,
      Listing_Agent_Email: item.agents_email,
    };
  });

  const transformedData = {
    Properties: {
      Property: transformedProperties,
    },
  };

  return new Response(JSON.stringify(transformedData), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
