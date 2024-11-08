// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

const errorResponse = (message: string, status = 400) => {
  return new Response(JSON.stringify(message), { status, headers });
};

const successResponse = (data: any) => {
  return new Response(JSON.stringify(data), { status: 200, headers });
};

async function checkExistingContact(supabase: any, email: string) {
  const { data: existingSeller } = await supabase
    .from("contacts")
    .select("id")
    .eq("contact_email", email)
    .single();

  if (existingSeller) {
    throw `A contact with the email ${email} already exists`;
  }
}

async function getReferenceNumber(supabase: any, data: any) {
  const { data: referenceNumber, error } = await supabase.rpc(
    "generate_reference_number",
    {
      type: data.property_type,
    },
  );
  if (error || !data) {
    throw error?.message || "Failed to generate reference number";
  }

  return referenceNumber;
}

async function createContact(supabase: any, data: any) {
  const isValidContactName = data.s_first_name && data.s_surname;
  const { data: contact, error } = await supabase
    .from("contacts")
    .insert({
      contact_first_name: data.s_first_name ?? null,
      contact_surname: data.s_surname ?? null,
      contact_name: isValidContactName
        ? `${data.s_first_name} ${data.s_surname}`
        : null,
      contact_phone: data.s_phone ?? null,
      contact_email: data.s_email ?? null,
      contact_class: data.s_contact_class ?? null,
      nationality: data.s_nationality ?? null,
      birth_date: data.s_birth_date ?? null,
      passport_number: data.s_passport_number ?? null,
      passport_issued_date: data.s_passport_issued_date ?? null,
      passport_expiry_date: data.s_passport_expiry_date ?? null,
      mailing_address_1: data.s_mailing_address_1 ?? null,
      mailing_address_2: data.s_mailing_address_2 ?? null,
      mailing_city: data.s_mailing_city ?? null,
      mailing_state: data.s_mailing_state ?? null,
      notes: data.s_notes ?? null,
    })
    .select()
    .single();

  if (error || !contact) {
    throw error?.message || "Failed to create contact";
  }

  return contact;
}

async function createProperty(supabase: any, data: any) {
  const { data: property, error } = await supabase
    .from("property")
    .insert({
      country: data.country ?? null,
      state: data.state ?? null,
      city: data.city ?? null,
      district: data.district ?? null,
      community: data.community ?? null,
      sub_community: data.sub_community ?? null,
      property_name: data.property_name ?? null,
      off_plan_property: data.offplan ?? null,
      lng_lat: data.lng_lat ?? null,
    })
    .select()
    .single();

  if (error || !property) {
    throw error?.message || "Failed to create property";
  }

  return property;
}

async function createPropertyListing(
  supabase: any,
  data: any,
  propertyId: string,
  contactId: string,
  referenceNumber?: string,
) {
  const { data: propertyListing, error } = await supabase
    .from("property_listings")
    .insert({
      property_number: data.property_number ?? null,
      property_ref: propertyId ?? null,
      reference_number: referenceNumber ?? null,
      internal_status: data.internal_status ?? null,
      type: data.type ?? null,
      permit_number: data.permit_number ?? null,
      dtcm_permit: data.dtcm_permit ?? null,
      property_type: data.property_type ?? null,
      price: data.price ?? null,
      service_charge: data.service_charge ?? null,
      annual_cheques: data.annual_cheques ?? null,
      title_en: data.title_en ?? null,
      title_ar: data.title_ar ?? null,
      description_en: data.description_en ?? null,
      description_ar: data.description_ar ?? null,
      property_size: data.property_size ?? null,
      build_year: data.build_year ?? null,
      floor: data.floor ?? null,
      stories: data.stories ?? null,
      parking: data.parking ?? null,
      furnished: data.furnished ?? null,
      platforms: data.platforms ?? null,
      rent_frequency: data.rent_frequency ?? null,
      offplan: data.offplan ?? null,
      offplan_sale_type: data.offplan_sale_type ?? null,
      offplan_dld_waiver: data.offplan_dld_waiver ?? null,
      offplan_original_price: data.offplan_original_price ?? null,
      offplan_amount_paid: data.offplan_amount_paid ?? null,
      title_deed: data.title_deed ?? null,
      availability_date: data.availability_date ?? null,
      developer_name: data.developer_name ?? null,
      project_name: data.project_name ?? null,
      completion_status: data.completion_status ?? null,
      agent_id: data.agent_id ?? null,
      seller_landlord_id: contactId ?? null,
      include_price: data.include_price ?? null,
      land_size: data.land_size ?? null,
      private_amenities: data.private_amenities ?? null,
      commercial_amenities: data.commercial_amenities ?? null,
      property_size_unit: data.property_size_unit ?? null,
      bedroom: data.bedroom ?? null,
      bathrooms: data.bathrooms ?? null,
      property_status: data.property_status ?? null,
      property_purpose: data.property_purpose ?? null,
      main_photo: data.main_photo ?? null,
    })
    .select()
    .single();

  if (error || !propertyListing) {
    throw error?.message || "Failed to create property listing";
  }

  return propertyListing;
}

async function createLead(
  supabase: any,
  data: any,
  propertyListing: any,
  contact: any,
  property: any,
) {
  const { data: lead, error } = await supabase
    .from("leads")
    .insert({
      entered_by_id: data.entered_by_id ?? null,
      referred_by_id: data.entered_by_id ?? null,
      referred_to_id: data.agent_id ?? null,
      property_type: data.property_type ?? null,
      unit_ref_no: propertyListing.reference_number ?? null,
      community: data.community ?? null,
      sub_community: data.sub_community ?? null,
      property: property.property_name ?? null,
      contact_name: contact.contact_name ?? null,
      contact_type: data.type.toLowerCase() === "sales" ? "Seller" : "Landlord",
      lead_status: "Open",
      bathroom: data.bathrooms ?? null,
      lead_method_of_contact: data.lead_method_of_contact ?? null,
      notes: data.s_notes ?? null,
      lead_id: contact.id ?? null,
      bedroom: data.bedroom ?? null,
    })
    .select()
    .single();

  if (error) {
    throw error.message || "Failed to create lead";
  }
  return lead.lead_no;
}

// @ts-ignore
Deno.serve(async (req: Request) => {
  try {
    if (req.method !== "POST") {
      return errorResponse("Method not allowed", 405);
    }

    const supabase = createClient(
      // @ts-ignore
      Deno.env.get("SUPABASE_URL") ?? "",
      // @ts-ignore
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      },
    );

    let requestBody;
    try {
      requestBody = await req.json();
    } catch {
      return errorResponse("Invalid JSON in request body");
    }

    const { s_first_name, s_surname, s_phone, s_email } = requestBody;
    if (!s_first_name || !s_surname || !s_phone || !s_email) {
      return errorResponse("Incomplete personal details");
    }

    await checkExistingContact(supabase, s_email);

    const contact = await createContact(supabase, requestBody);
    const property = await createProperty(supabase, requestBody);
    const referenceNumber = await getReferenceNumber(supabase, requestBody);
    const propertyListing = await createPropertyListing(
      supabase,
      requestBody,
      property.id,
      contact.id,
      referenceNumber,
    );
    const lead_no = await createLead(
      supabase,
      requestBody,
      propertyListing,
      contact,
      property,
    );

    return successResponse({ ...propertyListing, lead_no });
  } catch (error) {
    return errorResponse(error as string, 500);
  }
});
