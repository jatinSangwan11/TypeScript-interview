console.log("1: synchronous start");

setTimeout(() => {
  console.log("2: timer callback");
}, 0);

Promise.resolve().then(() => {
  console.log("3: promise callback");
});

async function run(): Promise<void> {
  console.log("4: inside async function");

  await Promise.resolve();

  console.log("5: after await");
}

void run();

console.log("6: synchronous end");
