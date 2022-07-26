let EventEmitter = require('events');
class Clock extends EventEmitter {
  constructor() {
    super();
    this.running = false;
    this.intervalID = 0;
    this.ms = 0;
  }

  start(makeEvent = true) {
    this.pms = Date.now();
    this.intervalID = setInterval(() => {
      let now = Date.now();
      let delta = now - this.pms;
      this.tick(delta);
      this.pms = now;
      this.emit('tick');
    }, 100);
    this.running = true;
    if (makeEvent) this.emit('start');
  }

  stop(makeEvent = true) {
    clearInterval(this.intervalID);
    this.running = false;
    if (makeEvent) this.emit('stop');
  }
}

class Stopwatch extends Clock {
  constructor() {
    super();
  }
  tick(delta) {
    this.ms += delta;
  }
}

class Timer extends Clock {
  constructor(ms) {
    super();
    this.ms = ms;
    this.finished = false;
  }

  tick(delta) {
    if (this.finished) return;
    this.ms -= delta;
    if (this.ms <= 0) {
      this.finished = true;
      this.stop(false);
      this.emit('done');
    }
  }
}

module.exports = {
  Stopwatch,
  Timer,
};
