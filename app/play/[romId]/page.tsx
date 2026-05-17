"use client";

import type { Metadata } from "next";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import NesEmulatorClient from "@/components/nes/NesEmulatorClient";
import { sampleRoms } from "@/lib/nes/sampleRoms";

export default function PlayPage() {
  const params = useParams();
  const router = useRouter();
  const romId = params.romId as string;
  
  const [rom, setRom] = useState<typeof sampleRoms[0] | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const foundRom = sampleRoms.find(r => r.id === romId);
    if (foundRom) {
      setRom(foundRom);
    } else {
      // 如果找不到对应的ROM，重定向到ROM列表页
      router.push("/roms");
    }
  }, [romId, router]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  if (!rom) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">🎮</div>
          <h1 className="text-2xl font-bold">加载中...</h1>
          <Link href="/roms" className="text-[#e60012] hover:text-red-400">
            返回游戏列表
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* 顶部导航栏 - 非全屏时显示 */}
      {!isFullscreen && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-gray-950/95 backdrop-blur border-b border-gray-800 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/roms"
                className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
              >
                ← 返回列表
              </Link>
              <div className="h-4 w-px bg-gray-700" />
              <h1 className="font-bold truncate max-w-xs">{rom.title}</h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleFullscreen}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors"
              >
                {isFullscreen ? "退出全屏" : "全屏模式"}
              </button>
              <Link
                href="/compliance"
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors"
              >
                合规说明
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 游戏主区域 */}
      <div className={`pt-20 ${isFullscreen ? "pt-0" : ""}`}>
        <NesEmulatorClient selectedRomId={romId} />
      </div>

      {/* 底部游戏信息栏 - 非全屏时显示 */}
      {!isFullscreen && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-950/95 backdrop-blur border-t border-gray-800 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center gap-4">
              <span>来源：{rom.sourceLabel}</span>
              <span>许可证：{rom.licenseName}</span>
            </div>
            <div className="flex items-center gap-4">
              <a
                href={rom.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
              >
                查看项目源码 →
              </a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
