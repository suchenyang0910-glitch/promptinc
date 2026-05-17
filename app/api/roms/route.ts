import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase客户端未初始化" },
        { status: 500 }
      );
    }
    
    const { data: roms, error } = await supabase
      .from("roms")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("获取ROM列表失败:", error);
      return NextResponse.json(
        { error: "获取ROM列表失败" },
        { status: 500 }
      );
    }

    return NextResponse.json({ roms });
  } catch (error) {
    console.error("服务器错误:", error);
    return NextResponse.json(
      { error: "服务器内部错误" },
      { status: 500 }
    );
  }
}
