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
    property_id,
    lead_no,
    description = null,
    date = null,
    task_time = null,
    type = "notes",
    contact_ref = null,
    assignee_id = null,
    assigner_id = null,
  } = await req.json();

  const defaultQuery = {
    description,
    date,
    task_time,
    type,
    property_id,
    lead_no,
    assigner_id,
  };
  const query =
    type === "notes"
      ? defaultQuery
      : { ...defaultQuery, contact_ref, assignee_id };

  if (!property_id || !lead_no) {
    const error = !property_id
      ? "property_id is required"
      : "lead_no is required";
    return new Response(error, {
      status: 400,
    });
  }

  if (date) {
    const clientDate = new Date(date);
    const now = new Date();

    // Parse time correctly
    let hours = 0,
      minutes = 0,
      seconds = 0;
    if (task_time && task_time.trim() !== "") {
      const timeParts = task_time.match(/(\d+):(\d+)\s*(AM|PM)?/i);
      if (timeParts) {
        hours = parseInt(timeParts[1]);
        minutes = parseInt(timeParts[2]);
        if (timeParts[3] && timeParts[3].toUpperCase() === "PM" && hours < 12) {
          hours += 12;
        } else if (
          timeParts[3] &&
          timeParts[3].toUpperCase() === "AM" &&
          hours === 12
        ) {
          hours = 0;
        }
      }
    } else {
      hours = now.getHours();
      minutes = now.getMinutes();
      seconds = now.getSeconds();
    }

    const selectedDateTime = new Date(
      clientDate.getFullYear(),
      clientDate.getMonth(),
      clientDate.getDate(),
      hours,
      minutes,
      seconds,
    );
    // Validate if the selected date and time is in the future
    if (isNaN(selectedDateTime.getTime()) || selectedDateTime <= now) {
      return new Response("Date and time must be in the future", {
        status: 400,
      });
    }
  }

  // Database queries will have RLS policies enforced
  const { data, error } = await supabaseClient.rpc("insert_task", {
    ...query,
  });

  if (error) {
    return new Response(JSON.stringify(error.message), {
      status: 500,
    });
  }

  const response = {
    message: "Task inserted successfully",
    data,
  };

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
