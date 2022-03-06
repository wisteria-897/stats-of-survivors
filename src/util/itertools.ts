export type IterCallback<T, U> = (item: T, index: number, source: ChainableIterable<T>) => U;
export type IterPredicate<T> = IterCallback<T, boolean>;
export type IterConsumer<T> = IterCallback<T, void>;

type IterableProvider<T> = () => Iterable<T>;
export class ChainableIterable<T> implements Iterable<T> {
    private readonly generator: IterableProvider<T>;

    constructor(generator: IterableProvider<T>) {
        this.generator = generator;
    }

    *[Symbol.iterator]() {
        yield *this.generator();
    }

    asArray(): T[] {
        const items = [];
        for (let item of this) {
            items.push(item);
        }

        return items;
    }

    any(fn: IterPredicate<T>): boolean {
        return !this.every((...args) => !fn(...args));
    }

    every(fn: IterPredicate<T>): boolean {
        let index = 0;
        for (let item of this) {
            if (!fn(item, index, this)) {
                return false;
            }
        }

        return true;
    }

    filter(fn: IterPredicate<T>): ChainableIterable<T> {
        const source = this;
        return chainable(function* () {
            let index = 0;
            for (let item of source) {
                if (fn(item, index, source)) {
                    yield item;
                }
                index += 1;
            }
        });
    }

    forEach(fn: IterConsumer<T>): void {
        let index = 0;
        for (let item of this) {
            fn(item, index, this);
            index += 1;
        }
    }

    map<U>(fn: IterCallback<T, U>): ChainableIterable<U> {
        const source = this;
        return chainable(function* () {
            let index = 0;
            for (let tile of source) {
                yield fn(tile, index, source);
                index += 1;
            }
        });
    }

    reduce<S>(fn: (previous: S, item: T, index: number, source: ChainableIterable<T>) => S, initial: S): S {
        let index = 0;
        let result = initial;
        for (let item of this) {
            result = fn(result, item, index, this);
            index += 1;
        }

        return result;
    }

    unique(): ChainableIterable<T> {
        const uniqueItems = new Set();
        return this.filter(x => {
            if (!uniqueItems.has(x)) {
                uniqueItems.add(x);
                return true;
            }
            return false;
        });
    }

    notNull(): ChainableIterable<NonNullable<T>> {
        // @ts-ignore
        return this.filter(x => x != null);
    }
}

export const chainable = <T>(source: IterableProvider<T>): ChainableIterable<T> => {
    return new ChainableIterable(source);
};
