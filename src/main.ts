import { Cmpx } from "./math";
import { drawMandelbrot } from "./render";

const limit = 10e3;
const size = 4096;

const locations = new Map<string, [Cmpx, Cmpx]>([
  [
    "default",
    [
      [-2, -1.5],
      [1, 1.5],
    ],
  ],
  [
    "web",
    [
      [-0.748 - 0.0014, 0.1 - 0.0014],
      [-0.748 + 0.0014, 0.1 + 0.0014],
    ],
  ],
]);

const canvas = document.createElement("canvas");
canvas.width = canvas.height = size;

canvas.style.cssText =
  "max-width: 100%; box-shadow: 0 10px 20px rgba(0,0,0,0.5)";

document.body.append(canvas);

const [topLeft, bottomRight] = locations.get("default")!;

performance.mark("start");

drawMandelbrot(canvas, topLeft, bottomRight, 1000).then(() => {
  performance.mark("end");
  performance.measure("draw", "start", "end");
  console.log(
    "Drawing took",
    performance.getEntriesByName("draw")[0].duration,
    "ms",
    `${size} × ${size} @ ${limit}`
  );
});
