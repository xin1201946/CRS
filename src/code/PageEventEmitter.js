import { EventEmitter } from 'events';

const emitter = new EventEmitter();

export const emit = emitter.emit.bind(emitter);
export const on = emitter.on.bind(emitter);
export const off = emitter.off.bind(emitter);