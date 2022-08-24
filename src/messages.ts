import { Cmpx } from "./math";

export enum MessageType {
  Init,
  Render,
}

export interface InitMessage {
  id: number;
  type: MessageType.Init;
  width: number;
  height: number;
  buffer: SharedArrayBuffer;
  messagePort: MessagePort;
}

export interface RenderMessage {
  id: number;
  type: MessageType.Render;
  size: Cmpx;
  bounds: [Cmpx, Cmpx];
  limit: number;
}

export type WorkerMessage = InitMessage | RenderMessage;

export enum ResponseType {
  OK,
  Error,
}

export interface ACKMessage {
  type: ResponseType.OK;
  id: number;
  data: ArrayBuffer;
}

export interface ErrorMessage {
  type: ResponseType.Error;
  id: number;
  err?: any;
}

export type WorkerResponse = ACKMessage | ErrorMessage;
