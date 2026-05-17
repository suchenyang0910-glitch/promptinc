declare module "jsnes" {
  export const Controller: {
    BUTTON_A: number;
    BUTTON_B: number;
    BUTTON_SELECT: number;
    BUTTON_START: number;
    BUTTON_UP: number;
    BUTTON_DOWN: number;
    BUTTON_LEFT: number;
    BUTTON_RIGHT: number;
  };

  export class NES {
    constructor(opts?: {
      onFrame?: (framebuffer24: number[]) => void;
      onAudioSample?: (l: number, r: number) => void;
      onStatusUpdate?: (status: string) => void;
    });
    loadROM(romData: string): void;
    frame(): void;
    buttonDown(player: number, button: number): void;
    buttonUp(player: number, button: number): void;
  }
}

