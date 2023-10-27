export class Stopwatch {
  private startTime: number | null = null;
  private elapsedTime: number = 0;

  // Starts the stopwatch
  static StartNew(): Stopwatch {
    const stopwatch = new Stopwatch();
    stopwatch.start();
    return stopwatch;
  }

  // Starts the stopwatch
  start(): void {
    if (this.startTime === null) {
      this.startTime = Date.now();
    }
  }

  // Stops the stopwatch
  stop(): void {
    if (this.startTime !== null) {
      this.elapsedTime += Date.now() - this.startTime;
      this.startTime = null;
    }
  }

  // Resets the stopwatch
  reset(): void {
    this.startTime = null;
    this.elapsedTime = 0;
  }

  // Gets the elapsed milliseconds
  getElapsedMilliseconds(): number {
    if (this.startTime !== null) {
      return this.elapsedTime + (Date.now() - this.startTime);
    }
    return this.elapsedTime;
  }
}
