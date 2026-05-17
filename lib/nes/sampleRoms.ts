export type SampleRom = {
  id: string;
  title: string;
  description: string;
  url: string;
  sourceLabel: string;
  sourceUrl: string;
  licenseName: string;
  licenseUrl: string;
};

export const sampleRoms: SampleRom[] = [
  {
    id: "starter",
    title: "NES Starter Kit · starter.nes",
    description: "入门示例 ROM（演示基本画面/输入）。",
    url: "https://raw.githubusercontent.com/battlelinegames/nes-starter-kit/master/starter.nes",
    sourceLabel: "battlelinegames/nes-starter-kit",
    sourceUrl: "https://github.com/battlelinegames/nes-starter-kit",
    licenseName: "MIT",
    licenseUrl: "https://github.com/battlelinegames/nes-starter-kit/blob/master/LICENSE",
  },
  {
    id: "nestress",
    title: "NEStress.NES",
    description: "压力/兼容性测试 ROM（包含可交互画面）。",
    url: "https://raw.githubusercontent.com/christopherpow/nes-test-roms/master/stress/NEStress.NES",
    sourceLabel: "christopherpow/nes-test-roms",
    sourceUrl: "https://github.com/christopherpow/nes-test-roms",
    licenseName: "见上游（文件页/同目录许可）",
    licenseUrl: "https://github.com/christopherpow/nes-test-roms/blob/master/stress/NEStress.NES",
  },
  {
    id: "nestest",
    title: "nestest.nes",
    description: "CPU 测试 ROM（菜单式测试套件）。",
    url: "https://raw.githubusercontent.com/christopherpow/nes-test-roms/master/other/nestest.nes",
    sourceLabel: "christopherpow/nes-test-roms",
    sourceUrl: "https://github.com/christopherpow/nes-test-roms",
    licenseName: "见上游（文件页/同目录许可）",
    licenseUrl: "https://github.com/christopherpow/nes-test-roms/blob/master/other/nestest.nes",
  },
  {
    id: "rasterdemo",
    title: "RasterDemo.NES",
    description: "栅格/PPU 相关演示 ROM。",
    url: "https://raw.githubusercontent.com/christopherpow/nes-test-roms/master/other/RasterDemo.NES",
    sourceLabel: "christopherpow/nes-test-roms",
    sourceUrl: "https://github.com/christopherpow/nes-test-roms",
    licenseName: "见上游（文件页/同目录许可）",
    licenseUrl: "https://github.com/christopherpow/nes-test-roms/blob/master/other/RasterDemo.NES",
  },
  {
    id: "rastertest1",
    title: "RasterTest1.NES",
    description: "栅格/PPU 相关测试 ROM。",
    url: "https://raw.githubusercontent.com/christopherpow/nes-test-roms/master/other/RasterTest1.NES",
    sourceLabel: "christopherpow/nes-test-roms",
    sourceUrl: "https://github.com/christopherpow/nes-test-roms",
    licenseName: "见上游（文件页/同目录许可）",
    licenseUrl: "https://github.com/christopherpow/nes-test-roms/blob/master/other/RasterTest1.NES",
  },
];

