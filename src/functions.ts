import { ThrottleOptions } from "./types";

type EnqueueFunction = (fn: () => Promise<void>) => Promise<void>;

export const createThrottle = ({ limit, interval }: ThrottleOptions) : EnqueueFunction => {
    let queue: (() => void)[] = [];
    console.log('queue: ', queue);
    let activeCount = 0;
    let lastExecutionTime = Date.now();
  
    const processQueue = async () => {
      while (queue.length > 0) {
        const now = Date.now();
  
        // Only process if enough time has passed or the queue is not fully processed yet
        if (activeCount < limit && (now - lastExecutionTime) >= interval) {
          const batch = queue.splice(0, limit); // Take the first 'limit' items from the queue
          // console.log('batch: ', batch);
          lastExecutionTime = now;
  
          activeCount += batch.length;
  
          await Promise.all(batch.map(fn => fn()));
  
          activeCount -= batch.length;
  
          // If there are still items in the queue, set a delay before processing the next batch
          if (queue.length > 0) {
            await new Promise(resolve => setTimeout(resolve, interval));
          }
        } else {
          await new Promise(resolve => setTimeout(resolve, Math.max(interval - (now - lastExecutionTime), 0)));
        }
      }
    };
  
    const enqueue = (fn: () => Promise<void>) => {
      return new Promise<void>((resolve, reject) => {
        queue.push(async () => {
          try {
            await fn();
            resolve();
          } catch (error) {
            reject(error);
          }
        });
        if (activeCount < limit) {
          processQueue();
        }
      });
    };
  
    return enqueue;
  };