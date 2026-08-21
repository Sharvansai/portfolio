import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message, honeypot } = body;

    // Honeypot spam check
    if (honeypot) {
      return NextResponse.json({ success: true, message: "Ignored" });
    }

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // In a server environment, you could also send emails via Resend/Nodemailer or persist to a DB.
    console.log("[Sharvan Base Contact Message Received]:", {
      timestamp: new Date().toISOString(),
      name,
      email,
      subject,
      message,
    });

    return NextResponse.json({
      success: true,
      message: "Message delivered to Sharvan Base successfully",
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
