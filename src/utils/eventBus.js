/**
 * EVENT BUS — Global event emitter
 * Dùng để giao tiếp giữa các module không liên quan
 */
const EventBus = {
  _events: {},

  on(event, fn) {
    if (!this._events[event]) this._events[event] = [];
    this._events[event].push(fn);
    return () => this.off(event, fn);
  },

  off(event, fn) {
    if (!this._events[event]) return;
    this._events[event] = this._events[event].filter(l => l !== fn);
  },

  emit(event, ...args) {
    (this._events[event] || []).forEach(fn => fn(...args));
  },

  once(event, fn) {
    const wrapper = (...args) => {
      fn(...args);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
  },
};

export default EventBus;
