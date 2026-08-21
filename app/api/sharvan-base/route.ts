import { NextResponse } from "next/server";
import { initialSharvanBaseData } from "@/lib/sharvan-base-data";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const STORE_PATH = path.join(process.cwd(), "data", "sharvan_base_store.json");

function getStoredData() {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const raw = fs.readFileSync(STORE_PATH, "utf-8");
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Error reading sharvan base store:", e);
  }
  return initialSharvanBaseData;
}

export async function GET() {
  const data = getStoredData();
  return NextResponse.json({
    success: true,
    data,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Ensure name is strictly locked
    if (body.profile) {
      body.profile.name = "C S SHARVAN SAI";
    }

    const dir = path.dirname(STORE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(STORE_PATH, JSON.stringify(body, null, 2), "utf-8");

    return NextResponse.json({
      success: true,
      data: body,
    });
  } catch (e) {
    console.error("Error saving sharvan base store:", e);
    return NextResponse.json({ success: false, error: "Failed to persist data" }, { status: 500 });
  }
}
