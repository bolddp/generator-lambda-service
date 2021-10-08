import { Log } from './Log';

export interface P<T> {
  get(): T;
}

/**
 * An instance getter that provides a singleton of a specific type. The instance
 * is lazy loaded on the first request of it.
 */
export class Singleton<T> implements P<T> {
  private instance?: T;
  private creator: () => T;
  name: string;

  constructor(creator: () => T, name: string) {
    this.creator = creator;
    this.name = name;
  }

  get(): T {
    if (!this.instance) {
      new Log(this.name).info('constructed');
      this.instance = this.creator();
    }
    return this.instance;
  }
}

export class Set<T> {
  creator: () => P<T>[];

  constructor(creator: () => P<T>[]) {
    this.creator = creator;
  }

  get(): T[] {
    return this.creator().map((x) => x.get());
  }
}
