// 从 'events' 模块导入 EventEmitter 类，用于创建事件发射器
// Import the EventEmitter class from the 'events' module to create an event emitter
import { EventEmitter } from 'events';

// 创建一个 EventEmitter 实例，用于在页面中处理事件
// Create an instance of EventEmitter to handle events on the page
const emitter = new EventEmitter();

/**
 * 触发一个页面切换事件。
 * Triggers a page switch event.
 * 此函数是 emitter.emit 方法的绑定版本。
 * This function is a bound version of the emitter.emit method.
 * @param {string} event - 要触发的事件名称。
 * @param {string} event - The name of the event to emit.
 * @param {...any} args - 传递给事件监听器的参数。
 * @param {...any} args - Arguments to pass to the event listeners.
 * @returns {boolean} - 如果事件有监听器则返回 true，否则返回 false。
 * @returns {boolean} - Returns true if the event had listeners, false otherwise.
 */
export const emit = emitter.emit.bind(emitter);

/**
 * 为页面切换添加一个监听器。
 * Add a listener for page switching.
 * 此函数是 emitter.on 方法的绑定版本。
 * This function is a bound version of the emitter.on method.
 * @param {string} event - 要监听的事件名称。
 * @param {string} event - The name of the event to listen for.
 * @param {function} listener - 事件触发时调用的回调函数。
 * @param {function} listener - The callback function to call when the event is emitted.
 * @returns {EventEmitter} - 返回 EventEmitter 实例，以便链式调用。
 * @returns {EventEmitter} - Returns the EventEmitter instance for chaining.
 */
export const on = emitter.on.bind(emitter);

/**
 * 移除页面切换的监听器。
 * Remove the listener for page switching.
 * 此函数是 emitter.off 方法的绑定版本。
 * This function is a bound version of the emitter.off method.
 * @param {string} event - 要移除监听器的事件名称。
 * @param {string} event - The name of the event to remove the listener from.
 * @param {function} listener - 要移除的监听器函数。
 * @param {function} listener - The listener function to remove.
 * @returns {EventEmitter} - 返回 EventEmitter 实例，以便链式调用。
 * @returns {EventEmitter} - Returns the EventEmitter instance for chaining.
 */
export const off = emitter.off.bind(emitter);
