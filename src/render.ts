import { mandelbrot, map, Cmpx } from "./math";

const colors = [
  0x00429d, 0x325da9, 0x4e78b5, 0x6694c1, 0x80b1cc, 0x9dced6, 0xc0eade,
  0xffffe0, 0xffdac4, 0xffb3a7, 0xfb8a8c, 0xeb6574, 0xd5405e, 0xb81b4a,
  0x93003a,
] as const;

const mapIterationToColor = (iter: number) => colors[iter % colors.length];

export const drawMandelbrot = async (
  canvas: HTMLCanvasElement,
  topLeft: Cmpx,
  bottomRight: Cmpx,
  limit: number
) => {
  const ctx = canvas.getContext("2d")!;
  const buffer = ctx.createImageData(canvas.width, canvas.height);
  const { data } = buffer;
  const xToI = map(0, canvas.width - 1, topLeft[0], bottomRight[0]);
  const yToJ = map(0, canvas.height - 1, topLeft[1], bottomRight[1]);
  for (let y = 0; y < canvas.height; y++) {
    const row = y * canvas.width * 4;
    for (let x = 0; x < canvas.width; x++) {
      const idx = row + x * 4;
      const i = xToI(x);
      const j = yToJ(y);
      const [iter] = mandelbrot([i, j], limit);
      const value = mapIterationToColor(iter);
      data[idx] = value & 0xff;
      data[idx + 1] = (value >> 8) & 0xff;
      data[idx + 2] = (value >> 16) & 0xff;
      data[idx + 3] = 0xff;
    }
  }
  ctx.putImageData(buffer, 0, 0);
};
