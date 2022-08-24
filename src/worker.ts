import { mandelbrot, map } from "./math";
import {
  ACKMessage,
  MessageType,
  RenderMessage,
  ResponseType,
  WorkerMessage,
} from "./messages";

const colors = [
  0x00429d, 0x325da9, 0x4e78b5, 0x6694c1, 0x80b1cc, 0x9dced6, 0xc0eade,
  0xffffe0, 0xffdac4, 0xffb3a7, 0xfb8a8c, 0xeb6574, 0xd5405e, 0xb81b4a,
  0x93003a,
] as const;

const mapIterationToColor = (iter: number) => colors[iter % colors.length];

const onRender = (data: RenderMessage) => {
  const view = new Uint8ClampedArray(data.size[0] * data.size[1] * 4);
  const xToI = map(0, data.size[0], data.bounds[0][0], data.bounds[1][0]);
  const yToJ = map(0, data.size[1], data.bounds[0][1], data.bounds[1][1]);
  for (let y = 0; y < data.size[1]; y++) {
    const row = y * data.size[0] * 4;
    for (let x = 0; x < data.size[0]; x++) {
      const idx = row + x * 4;
      const i = xToI(x);
      const j = yToJ(y);
      const [iter] = mandelbrot([i, j], data.limit);
      const value = mapIterationToColor(iter);
      view[idx] = value & 0xff;
      view[idx + 1] = (value >> 8) & 0xff;
      view[idx + 2] = (value >> 16) & 0xff;
      view[idx + 3] = 0xff;
    }
  }
  postMessage({
    type: ResponseType.OK,
    id: data.id,
    data: view,
  } as ACKMessage);
};

self.addEventListener("message", (ev: MessageEvent<WorkerMessage>) => {
  switch (ev.data.type) {
    case MessageType.Render: {
      onRender(ev.data);
      break;
    }
  }
});
