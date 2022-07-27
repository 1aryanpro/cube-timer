const { Stopwatch, Timer } = require('./clock');

const clc = require('cli-color');
const Scrambow = require('scrambow').Scrambow;
let threebythree = new Scrambow();

const genScramble = () => threebythree.get()[0].scramble_string;
const write = (str) => process.stdout.write(str);
const resetLine = () => write(clc.erase.line + clc.move.lineBegin);

require('readline').emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
write('\u001B[?25l');
process.stdin.on('keypress', (_, key) => {
  if (key.name == 'q' || (key.ctrl && key.name == 'c')) {
    console.log();
    write('\u001B[?25h');
    process.exit();
  }
  if (key.name == 'space') trigger();
});

const states = {
  STARTING: 0,
  SCRAMBLING: 1,
  INSPECTING: 2,
  SOLVING: 3,
};
let state = states.STARTING;

let inspectTimer = new Timer(15000, 100);
inspectTimer.on('tick', (ms) => {
  resetLine();
  write(clc.green('Inspection: ') + Math.floor(ms / 1000));
});

let cubeTimer = new Stopwatch();
cubeTimer.on('tick', (ms) => {
  resetLine();
  write(clc.green('Solving: ') + (ms / 1000).toFixed(2));
});

let scramble;
let nextScramble = genScramble();

function trigger() {
  switch (state) {
    case states.STARTING:
      inspectTimer.reset();
      cubeTimer.reset();
      scramble = nextScramble;
      nextScramble = genScramble();
      console.log(clc.blue.bold(scramble));
      write(clc.red('Press Space to Start'));
      state = states.SCRAMBLING;
      break;
    case states.SCRAMBLING:
      inspectTimer.start();
      state = states.INSPECTING;
      break;
    case states.INSPECTING:
      inspectTimer.stop();
      cubeTimer.start();
      state = states.SOLVING;
      break;
    case states.SOLVING:
      cubeTimer.stop();
      state = states.STARTING;
      console.log();
      trigger();
      break;
  }
}
trigger();
