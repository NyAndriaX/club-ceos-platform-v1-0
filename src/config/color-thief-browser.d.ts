declare module 'color-thief-browser' {
  export class ColorThief {
    getColor(image: HTMLImageElement): [number, number, number];
    getPalette(image: HTMLImageElement, quality?: number, count?: number): [number, number, number][];
  }
  export default ColorThief;
}
