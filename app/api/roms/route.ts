import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase client is not initialized" },
        { status: 500 }
      );
    }
    
    const { data: roms, error } = await supabase
      .from("roms")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch ROM list:", error);
      return NextResponse.json(
        { error: "Failed to fetch ROM list" },
        { status: 500 }
      );
    }

    return NextResponse.json({ roms });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
