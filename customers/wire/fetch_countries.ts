// @ts-ignore

// @ts-ignore
Deno.serve(async (req: Request) => {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const responseData = data.map((item: any) => ({
      name: item.name.common,
      officialName: item.name.official,
      countryCode: item.flag,
      latLng: item.latlng,
    }));

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
