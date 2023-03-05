const { Subject } = require("rxjs");
const { takeUntil, delay } = require("rxjs/operators");

class Queue {
  constructor(interval) {
    this.queue$ = new Subject();
    this.interval = interval;
    this.isProcessing = false;
  }

  async push(task) {
    this.queue$.next(task);
    if (!this.isProcessing) {
      await this.processQueue();
    }
  }

  async processQueue() {
    this.isProcessing = true;
    while (this.queue$.observers.length > 0) {
      const task = await this.queue$
        .pipe(takeUntil(this.queue$), delay(this.interval))
        .toPromise();
      await task();
    }
    this.isProcessing = false;
  }
}

module.exports = Queue;
