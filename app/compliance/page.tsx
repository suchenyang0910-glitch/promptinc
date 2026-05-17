import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import AdSlot from "@/components/AdSlot";
import { sampleRoms } from "@/lib/nes/sampleRoms";

export const metadata: Metadata = {
  title: "合规声明 - NES模拟器版权与使用条款",
  description: "详细了解NES模拟器平台的合规性声明、版权说明和使用条款，所有内置ROM均获得合法授权。",
  alternates: {
    canonical: "/compliance",
  },
};

export default function CompliancePage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <section className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        {/* 导航栏 */}
        <nav className="flex items-center justify-between gap-4">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors">
            ← 返回首页
          </Link>
          <div className="flex items-center gap-4 text-sm flex-wrap justify-end">
            <Link href="/roms" className="text-gray-400 hover:text-white transition-colors">
              游戏列表
            </Link>
            <Link href="/nes" className="text-gray-400 hover:text-white transition-colors">
              模拟器
            </Link>
          </div>
        </nav>

        {/* 页面标题 */}
        <header className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-800 space-y-4">
          <h1 className="text-4xl font-bold text-[#e60012]">合规声明</h1>
          <p className="text-gray-300 text-lg">
            我们致力于合法合规地运营复古游戏平台，保护知识产权，为用户提供安全可靠的怀旧游戏体验。
          </p>
        </header>

        <AdSlot variant="banner" slot="compliance-top" />

        {/* 版权声明 */}
        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 space-y-6">
          <h2 className="text-2xl font-bold">版权声明</h2>
          <div className="prose prose-invert max-w-none space-y-4 text-gray-300">
            <p>
              本平台仅提供模拟器技术框架，不提供任何受版权保护的商业游戏ROM下载。所有在本平台上可直接运行的示例ROM均满足以下条件之一：
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>已进入公有领域（Public Domain）的作品</li>
              <li>获得原作者明确授权可自由分发的开源/免费作品</li>
              <li>用于测试、演示目的的技术示例ROM</li>
            </ul>
          </div>
        </div>

        {/* 用户责任 */}
        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 space-y-6">
          <h2 className="text-2xl font-bold">用户责任与义务</h2>
          <div className="prose prose-invert max-w-none space-y-4 text-gray-300">
            <p>使用本平台时，您同意并承诺：</p>
            <ul className="list-disc list-inside space-y-2">
              <li>仅上传您合法拥有版权或获得使用授权的ROM文件</li>
              <li>不将本平台用于任何商业用途</li>
              <li>尊重原作者和版权持有人的知识产权</li>
              <li>不在本平台上分发任何侵权的游戏内容</li>
            </ul>
            <p className="text-yellow-400 bg-yellow-950/50 p-4 rounded-xl border border-yellow-800">
              <strong>重要提示：</strong>您上传的任何ROM文件都仅在您的浏览器本地处理和运行，
              不会上传到我们的服务器。平台无法访问您本地的文件内容，相关法律责任由您自行承担。
            </p>
          </div>
        </div>

        {/* 示例ROM清单 */}
        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 space-y-6">
          <h2 className="text-2xl font-bold">内置示例ROM合规清单</h2>
          <p className="text-gray-400">以下是当前平台所有内置的可自由分发ROM及其授权信息：</p>
          
          <div className="space-y-4">
            {sampleRoms.map((rom) => (
              <div
                key={rom.id}
                className="bg-gray-950/50 rounded-xl p-5 border border-gray-800"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{rom.title}</h3>
                    <p className="text-sm text-gray-400">{rom.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 shrink-0">
                    <span className="px-3 py-1 bg-green-900/50 text-green-400 rounded-full text-xs font-medium border border-green-800">
                      {rom.licenseName}
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-800 flex flex-wrap gap-6 text-sm">
                  <a
                    href={rom.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    📦 项目源码：{rom.sourceLabel}
                  </a>
                  <a
                    href={rom.licenseUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    📜 查看许可证
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 使用条款 */}
        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 space-y-6">
          <h2 className="text-2xl font-bold">使用条款</h2>
          <div className="prose prose-invert max-w-none space-y-4 text-gray-300">
            <h3 className="text-xl font-semibold text-white">免责声明</h3>
            <p>
              本平台按"原样"提供，不提供任何明示或暗示的保证。我们不对因使用本平台而产生的任何直接、间接、偶然、特殊或后果性损害承担责任。
            </p>
            
            <h3 className="text-xl font-semibold text-white mt-6">知识产权</h3>
            <p>
              本平台的模拟器核心技术、网站设计、代码等知识产权归本平台所有。未经授权，不得复制、修改或分发。
            </p>

            <h3 className="text-xl font-semibold text-white mt-6">条款修改</h3>
            <p>
              我们保留随时修改本合规声明和使用条款的权利。修改后的条款将在本页面发布，继续使用本平台即表示您接受修改后的条款。
            </p>
          </div>
        </div>

        {/* 联系我们 */}
        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 space-y-6">
          <h2 className="text-2xl font-bold">版权投诉</h2>
          <p className="text-gray-300">
            如果您认为本平台上的任何内容侵犯了您的版权，请通过以下方式联系我们，我们将及时处理：
          </p>
          <div className="bg-gray-950/50 rounded-xl p-6 border border-gray-800">
            <p className="text-gray-300">
              <strong>邮箱：</strong>copyright@example.com<br />
              <strong>处理时效：</strong>我们会在收到投诉后的3个工作日内进行核实和处理
            </p>
          </div>
        </div>

        <AdSlot variant="banner" slot="compliance-bottom" />

        {/* 返回按钮 */}
        <div className="flex justify-center pb-8">
          <Link
            href="/roms"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#e60012] hover:bg-red-700 rounded-xl font-bold transition-colors"
          >
            浏览游戏列表 →
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
