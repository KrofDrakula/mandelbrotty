import { drawMandelbrot } from "./render";

const canvas = document.createElement("canvas");
canvas.width = canvas.height = 2048;
canvas.style.cssText =
  "max-width: 100%; box-shadow: 0 10px 20px rgba(0,0,0,0.5)";

document.body.append(canvas);

performance.mark("start");

drawMandelbrot(canvas, [-2, -1.5], [1, 1.5], 1000).then(() => {
  performance.mark("end");
  performance.measure("draw", "start", "end");
  console.log(
    "Drawing took",
    performance.getEntriesByName("draw")[0].duration,
    "ms"
  );
});
