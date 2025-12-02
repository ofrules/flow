import { AsyncLocalStorage } from "node:async_hooks";

export abstract class FlowDefinition<T> {
  private storage: AsyncLocalStorage<T> = new AsyncLocalStorage<T>();

  init<R, TArgs extends unknown[]>(
    data: T,
    callback: (...args: TArgs) => R,
    ...args: TArgs
  ): R {
    return this.storage.run(data, callback, ...args);
  }

  get(): T {
    const store = this.storage.getStore();
    if (!store) {
      throw new Error(
        "Cannot get store, method called outside of an asynchronous context"
      );
    }

    return store;
  }
}
