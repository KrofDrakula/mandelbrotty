import { mandelbrot, map } from "./math";
import {
  ACKMessage,
  MessageType,
  RenderMessage,
  ResponseType,
  WorkerMessage,
} from "./messages";

const colors = [
  0x00429d, 0x1248a0, 0x1e4da2, 0x2753a5, 0x2e59a8, 0x355fab, 0x3b65ad,
  0x416bb0, 0x4771b2, 0x4d77b5, 0x527db8, 0x5883ba, 0x5d8abd, 0x6390bf,
  0x6896c2, 0x6d9cc4, 0x73a2c6, 0x79a9c9, 0x7eafcb, 0x84b5cd, 0x8abccf,
  0x90c2d2, 0x97c8d4, 0x9eced6, 0xa5d5d8, 0xacdbda, 0xb4e1db, 0xbce7dd,
  0xc5eddf, 0xd0f3e0, 0xdbf8e1, 0xe9fce1, 0xfff7da, 0xffefd4, 0xffe7cd,
  0xffdec7, 0xffd6c1, 0xffcebb, 0xffc5b5, 0xffbcaf, 0xffb4a8, 0xffaba2,
  0xffa29c, 0xff9895, 0xfc9090, 0xfa888a, 0xf78085, 0xf4777f, 0xf06f7a,
  0xec6775, 0xe85f70, 0xe4576b, 0xdf4f66, 0xda4762, 0xd53f5d, 0xcf3759,
  0xc92e54, 0xc22650, 0xbc1e4c, 0xb41648, 0xad0e44, 0xa50641, 0x9c013d,
  0x93003a,
] as const;

const mapIterationToColor = (iter: number) => colors[iter % colors.length];

const reply = (id: number, data: Uint8ClampedArray) =>
  postMessage(
    {
      type: ResponseType.OK,
      id,
      data,
    } as ACKMessage,
    // @ts-ignore
    [data.buffer]
  );

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
      const iter = mandelbrot([i, j], data.limit);
      const value = mapIterationToColor(iter);
      view[idx] = value & 0xff;
      view[idx + 1] = (value >> 8) & 0xff;
      view[idx + 2] = (value >> 16) & 0xff;
      view[idx + 3] = 0xff;
    }
  }
  reply(data.id, view);
};

self.addEventListener("message", (ev: MessageEvent<WorkerMessage>) => {
  switch (ev.data.type) {
    case MessageType.Render: {
      onRender(ev.data);
      break;
    }
  }
});
