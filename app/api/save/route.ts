import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase客户端未初始化" },
        { status: 500 }
      );
    }
    
    // 验证用户是否已认证
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: "请先登录后再保存游戏进度" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { romId, saveData } = body;

    if (!romId || !saveData) {
      return NextResponse.json(
        { error: "缺少必要参数：romId 或 saveData" },
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
      console.error("保存存档失败:", result.error);
      return NextResponse.json(
        { error: "保存游戏进度失败" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      save: result.data,
      message: existingSave ? "游戏进度已更新" : "游戏进度已保存",
    });
  } catch (error) {
    console.error("服务器错误:", error);
    return NextResponse.json(
      { error: "服务器内部错误" },
      { status: 500 }
    );
  }
}
