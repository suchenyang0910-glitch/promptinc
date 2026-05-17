"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { sampleRoms } from "@/lib/nes/sampleRoms";

type RomItem = {
  id: string;
  title: string;
  description: string;
  url: string;
  sourceLabel: string;
  sourceUrl: string;
  licenseName: string;
  licenseUrl: string;
  genre: string;
  year: string;
  coverImage: string;
};

export default function RomsListClient() {
  const [roms, setRoms] = useState<RomItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("全部");
  
  const genres = ["全部", "动作", "射击", "益智", "冒险", "测试"];

  useEffect(() => {
    // 从API加载ROM数据
    const fetchRoms = async () => {
      try {
        const res = await fetch("/api/roms");
        const data = await res.json();
        if (data.roms && data.roms.length > 0) {
          // 数据库中有数据，使用数据库数据
          const formattedRoms: RomItem[] = data.roms.map((rom: any) => ({
            id: rom.id.slice(0, 8), // 使用UUID的前8位作为ID
            title: rom.name,
            description: `${rom.year}年发布 - ${rom.genre}类型游戏`,
            url: rom.rom_path,
            sourceLabel: "内置示例ROM",
            sourceUrl: "#",
            licenseName: rom.license_type,
            licenseUrl: "#",
            genre: rom.genre,
            year: rom.year,
            coverImage: rom.cover_image,
          }));
          setRoms(formattedRoms);
        } else {
          // 数据库为空，使用本地sampleRoms数据
          const localRoms: RomItem[] = sampleRoms.map(rom => ({
            ...rom,
            genre: rom.id.includes("test") || rom.id.includes("demo") ? "测试" : "动作",
            year: "1985",
            coverImage: `https://picsum.photos/seed/${rom.id}/400/300`,
          }));
          setRoms(localRoms);
        }
      } catch (error) {
        console.error("获取ROM列表失败，使用本地数据:", error);
        // API调用失败，使用本地sampleRoms数据
        const localRoms: RomItem[] = sampleRoms.map(rom => ({
          ...rom,
          genre: rom.id.includes("test") || rom.id.includes("demo") ? "测试" : "动作",
          year: "1985",
          coverImage: `https://picsum.photos/seed/${rom.id}/400/300`,
        }));
        setRoms(localRoms);
      } finally {
        setLoading(false);
      }
    };

    fetchRoms();
  }, []);

  // 过滤ROM
  const filteredRoms = roms.filter(rom => {
    const matchesSearch = rom.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === "全部" || rom.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  return (
    <>
      {/* 筛选和搜索区域 */}
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          {/* 分类筛选 */}
          <div className="flex flex-wrap gap-2">
            {genres.map(genre => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                  selectedGenre === genre
                    ? "bg-[#e60012] text-white"
                    : "bg-gray-800 hover:bg-gray-700"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
          {/* 搜索框 */}
          <div className="w-full md:w-auto">
            <input
              type="text"
              placeholder="搜索游戏..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-[#e60012] focus:outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      {/* ROM卡片网格 */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden animate-pulse">
              <div className="aspect-video bg-gray-800" />
              <div className="p-5 space-y-3">
                <div className="h-6 bg-gray-800 rounded w-3/4" />
                <div className="h-4 bg-gray-800 rounded w-1/2" />
                <div className="h-4 bg-gray-800 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRoms.map((rom) => (
            <div
              key={rom.id}
              className="group bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden hover:border-[#e60012] transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              {/* 游戏封面 */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={rom.coverImage}
                  alt={rom.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 bg-[#e60012] rounded text-xs font-bold">
                    {rom.genre}
                  </span>
                </div>
              </div>
              {/* 游戏信息 */}
              <div className="p-5 space-y-3">
                <h3 className="font-bold text-lg truncate">{rom.title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>{rom.year}</span>
                  <span>·</span>
                  <span className="truncate">{rom.licenseName}</span>
                </div>
                <p className="text-sm text-gray-400 line-clamp-2">{rom.description}</p>
                {/* 操作按钮 */}
                <div className="flex gap-2 pt-2">
                  <Link
                    href={`/play/${rom.id}`}
                    className="flex-1 py-2.5 bg-[#e60012] hover:bg-red-700 rounded-xl text-center font-bold transition-colors"
                  >
                    立即游玩
                  </Link>
                  <a
                    href={rom.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
                    title="查看来源"
                  >
                    ℹ️
                  </a>
                </div>
                {/* 许可信息 */}
                <div className="pt-2 border-t border-gray-800">
                  <a
                    href={rom.licenseUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {rom.licenseName} 许可证 · {rom.sourceLabel}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
