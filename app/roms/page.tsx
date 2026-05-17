import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import AdSlot from "@/components/AdSlot";
import RomsListClient from "./RomsListClient";

export const metadata: Metadata = {
  title: "NES 游戏列表 - 经典FC游戏在线玩",
  description: "浏览所有可免费玩的NES经典游戏，包含坦克大战、魂斗罗等怀旧游戏，所有ROM均合规可自由分发。",
  alternates: {
    canonical: "/roms",
  },
};

export default function RomsPage() {

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <section className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        {/* 导航栏 */}
        <nav className="flex items-center justify-between gap-4">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors">
            ← 返回首页
          </Link>
          <div className="flex items-center gap-4 text-sm flex-wrap justify-end">
            <Link href="/nes" className="text-gray-400 hover:text-white transition-colors">
              模拟器
            </Link>
            <Link href="/compliance" className="text-gray-400 hover:text-white transition-colors">
              合规声明
            </Link>
            <Link href="/games" className="text-gray-400 hover:text-white transition-colors">
              所有游戏
            </Link>
          </div>
        </nav>

        {/* 页面标题 */}
        <header className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-800 space-y-4">
          <h1 className="text-4xl font-bold text-[#e60012]">NES 经典游戏库</h1>
          <p className="text-gray-300 text-lg max-w-3xl">
            重温童年经典！这里收录了所有可自由分发的NES/FC游戏ROM，全部经过授权验证，
            点击即可在浏览器中在线游玩，支持键盘和触屏操作。
          </p>
        </header>

        <AdSlot variant="banner" slot="roms-top" />

        <RomsListClient />

        <AdSlot variant="banner" slot="roms-bottom" />

        {/* 说明区域 */}
        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
          <h2 className="text-2xl font-bold mb-4">关于我们的ROM库</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-300">
            <div className="space-y-2">
              <h3 className="font-semibold text-white">合规性保障</h3>
              <p className="text-sm leading-relaxed">
                所有内置ROM均为进入公有领域或获得作者明确授权可自由分发的作品，
                每个游戏都标注了具体的授权类型和来源，确保平台运营合法合规。
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-white">本地运行保护隐私</h3>
              <p className="text-sm leading-relaxed">
                所有游戏均在您的浏览器本地运行，不会上传任何个人数据。
                您也可以上传自己拥有的ROM文件，文件只会在本地处理，不会上传到任何服务器。
              </p>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-800">
            <Link
              href="/compliance"
              className="inline-flex items-center gap-2 text-[#e60012] hover:text-red-400 font-semibold transition-colors"
            >
              查看完整合规声明 →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
