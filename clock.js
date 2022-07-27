let EventEmitter = require('events');
class Clock extends EventEmitter {
  constructor(refreshRate = 10) {
    super();
    this.running = false;
    this.intervalID = 0;
    this.ms = 0;
    this.refreshRate = refreshRate;
  }

  start(makeEvent = true) {
    this.pms = Date.now();
    this.intervalID = setInterval(() => {
      let now = Date.now();
      let delta = now - this.pms;
      this.tick(delta);
      this.pms = now;
      this.emit('tick', this.ms);
    }, this.refreshRate);
    this.running = true;
    if (makeEvent) this.emit('start');
  }

  stop(makeEvent = true) {
    if (!this.running) return;
    clearInterval(this.intervalID);
    this.running = false;
    if (makeEvent) this.emit('stop');
  }
}

class Stopwatch extends Clock {
  constructor(refreshRate) {
    super(refreshRate);
  }

  tick(delta) {
    this.ms += delta;
  }

  reset() {
    this.ms = 0;
    this.emit('reset');
  }
}

class Timer extends Clock {
  constructor(len, refreshRate) {
    super(refreshRate);
    this.ms = len;
    this.len = len;
    this.finished = false;
  }

  tick(delta) {
    if (this.finished) return;
    this.ms -= delta;
    if (this.ms <= 0) {
      this.ms = 0;
      this.finished = true;
      this.stop(false);
      this.emit('done');
    }
  }

  reset() {
    this.ms = this.len;
    this.finished = false;
    this.stop();
    this.emit('reset');
  }
}

module.exports = {
  Stopwatch,
  Timer,
};
