export default class Registry<T, U> {
    private readonly map: Map<T, U>;
    private readonly getIdFn: (item: U) => T;

    constructor(getIdFn: (item: U) => T) {
        this.map = new Map();
        this.getIdFn = getIdFn;
    }

    getById(id: T): U | null {
        const item = this.map.get(id);
        if (item != null) {
            return item;
        }

        return null;
    }

    register(item: U) {
        const id = this.getIdFn(item);
        this.map.set(id, item);
    }
}
