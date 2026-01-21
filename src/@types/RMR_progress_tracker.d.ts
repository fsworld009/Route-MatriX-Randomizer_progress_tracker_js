declare global {
  declare namespace RMRPTJS {
    export interface Progress {
      [id: string]: number
    }

    export type NewItems = string[];

    export type Callback = (progress: Progress, newItems: NewItems) => void;

    export interface Options {
      baseUrl: string;
      callbacks: Callback[];
      interval: number;
    }
  }
  interface Window {
    RMRPTJS: {
      configure: (options: Partial<RMRPTJS.Options>) => void;
      start: () => void
    };
  }
}

export {}
