import { Block, blocks, Cmpx, map } from "./math";
import {
  MessageType,
  RenderMessage,
  ResponseType,
  WorkerResponse,
} from "./messages";
import RenderWorker from "./worker?worker";

let msgId = 0;
let workerId = 0;

const blockSize = 128;

const requests = new Map<number, Block>();

export const drawMandelbrot = async (
  canvas: HTMLCanvasElement,
  topLeft: Cmpx,
  bottomRight: Cmpx,
  limit: number
) =>
  new Promise<void>(async (resolve) => {
    const workers: Worker[] = [];
    for (let i = 0; i < navigator.hardwareConcurrency; i++)
      workers.push(new RenderWorker());

    const ctx = canvas.getContext("2d")!;

    const onMessage = (ev: MessageEvent<WorkerResponse>) => {
      if (ev.data.type == ResponseType.OK) {
        const block = requests.get(ev.data.id)!;
        const imgData = new ImageData(block.width, block.height);
        imgData.data.set(ev.data.data);
        ctx.putImageData(imgData, block.left, block.top);
        requests.delete(ev.data.id);
      }
      if (requests.size == 0) {
        resolve();
        workers.forEach((w) => {
          w.removeEventListener("message", onMessage);
          w.terminate();
        });
      }
    };

    workers.forEach((w) => w.addEventListener("message", onMessage));

    const xToI = map(0, canvas.width - 1, topLeft[0], bottomRight[0]);
    const yToJ = map(0, canvas.height - 1, topLeft[1], bottomRight[1]);

    for (const block of blocks(canvas.width, canvas.height, blockSize)) {
      requests.set(msgId, block);
      const from = [xToI(block.left), yToJ(block.top)];
      const to = [
        xToI(block.left + block.width),
        yToJ(block.top + block.height),
      ];
      workers[workerId++ % workers.length].postMessage({
        id: msgId,
        type: MessageType.Render,
        bounds: [from, to],
        limit,
        size: [block.width, block.height],
      } as RenderMessage);

      msgId++;
    }
  });
