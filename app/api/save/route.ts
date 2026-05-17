import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase client is not initialized" },
        { status: 500 }
      );
    }
    
    // 验证用户是否已认证
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: "Please sign in to save progress" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { romId, saveData } = body;

    if (!romId || !saveData) {
      return NextResponse.json(
        { error: "Missing required parameters: romId or saveData" },
        { status: 400 }
      );
    }

    // 先检查是否已有该ROM的存档，如果有则更新，没有则创建
    const { data: existingSave, error: findError } = await supabase
      .from("user_saves")
      .select("id")
      .eq("user_id", user.id)
      .eq("rom_id", romId)
      .single();

    let result;
    if (existingSave) {
      // 更新现有存档
      const { data, error: updateError } = await supabase
        .from("user_saves")
        .update({
          save_data: saveData,
          saved_at: new Date().toISOString(),
        })
        .eq("id", existingSave.id)
        .select()
        .single();
      result = { data, error: updateError };
    } else {
      // 创建新存档
      const { data, error: insertError } = await supabase
        .from("user_saves")
        .insert({
          user_id: user.id,
          rom_id: romId,
          save_data: saveData,
        })
        .select()
        .single();
      result = { data, error: insertError };
    }

    if (result.error) {
      console.error("Failed to save:", result.error);
      return NextResponse.json(
        { error: "Failed to save progress" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      save: result.data,
      message: existingSave ? "Progress updated" : "Progress saved",
    });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
