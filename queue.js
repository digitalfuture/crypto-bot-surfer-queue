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
    const subscription = this.queue$
      .pipe(takeUntil(this.queue$))
      .pipe(delay(this.interval))
      .subscribe(async (task) => {
        await task();
      });
    await subscription.toPromise();
    this.isProcessing = false;
  }
}

module.exports = Queue;
