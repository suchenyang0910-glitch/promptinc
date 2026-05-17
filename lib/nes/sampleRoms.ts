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
    description: "Starter ROM for basic graphics and input.",
    url: "https://raw.githubusercontent.com/battlelinegames/nes-starter-kit/master/starter.nes",
    sourceLabel: "battlelinegames/nes-starter-kit",
    sourceUrl: "https://github.com/battlelinegames/nes-starter-kit",
    licenseName: "MIT",
    licenseUrl: "https://github.com/battlelinegames/nes-starter-kit/blob/master/LICENSE",
  },
  {
    id: "nestress",
    title: "NEStress.NES",
    description: "Stress and compatibility test ROM with interactive output.",
    url: "https://raw.githubusercontent.com/christopherpow/nes-test-roms/master/stress/NEStress.NES",
    sourceLabel: "christopherpow/nes-test-roms",
    sourceUrl: "https://github.com/christopherpow/nes-test-roms",
    licenseName: "See upstream (file page / directory license)",
    licenseUrl: "https://github.com/christopherpow/nes-test-roms/blob/master/stress/NEStress.NES",
  },
  {
    id: "nestest",
    title: "nestest.nes",
    description: "CPU test ROM (menu-driven test suite).",
    url: "https://raw.githubusercontent.com/christopherpow/nes-test-roms/master/other/nestest.nes",
    sourceLabel: "christopherpow/nes-test-roms",
    sourceUrl: "https://github.com/christopherpow/nes-test-roms",
    licenseName: "See upstream (file page / directory license)",
    licenseUrl: "https://github.com/christopherpow/nes-test-roms/blob/master/other/nestest.nes",
  },
  {
    id: "rasterdemo",
    title: "RasterDemo.NES",
    description: "Raster/PPU demo ROM.",
    url: "https://raw.githubusercontent.com/christopherpow/nes-test-roms/master/other/RasterDemo.NES",
    sourceLabel: "christopherpow/nes-test-roms",
    sourceUrl: "https://github.com/christopherpow/nes-test-roms",
    licenseName: "See upstream (file page / directory license)",
    licenseUrl: "https://github.com/christopherpow/nes-test-roms/blob/master/other/RasterDemo.NES",
  },
  {
    id: "rastertest1",
    title: "RasterTest1.NES",
    description: "Raster/PPU test ROM.",
    url: "https://raw.githubusercontent.com/christopherpow/nes-test-roms/master/other/RasterTest1.NES",
    sourceLabel: "christopherpow/nes-test-roms",
    sourceUrl: "https://github.com/christopherpow/nes-test-roms",
    licenseName: "See upstream (file page / directory license)",
    licenseUrl: "https://github.com/christopherpow/nes-test-roms/blob/master/other/RasterTest1.NES",
  },
];
