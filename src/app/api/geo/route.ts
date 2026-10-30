import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Check standard CDN & proxy geo headers
  const country =
    req.headers.get("x-vercel-ip-country") ||
    req.headers.get("cf-ipcountry") ||
    req.headers.get("x-country-code") ||
    req.headers.get("cloudfront-viewer-country") ||
    req.headers.get("x-appengine-country") ||
    "";

  const isIndia = country.toUpperCase() === "IN";

  return NextResponse.json({
    country: country.toUpperCase(),
    isIndia,
    currency: isIndia ? "INR" : "USD",
  });
}
