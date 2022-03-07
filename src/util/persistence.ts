const storageKeyBase = 'sos';
export function createPersister<T>(key: string, initialValue: T, serialize?: (value: T) => string, deserialize?: (data: string) => T) {
    const fullKey = storageKeyBase + ':' + key;
    return {
        load: () => {
            const json = localStorage.getItem(fullKey);
            if (json) {
                return deserialize ? deserialize(json) : JSON.parse(json);
            } else {
                return initialValue;
            }
        },
        save: (value: T) => {
            const serialized = serialize ? serialize(value) : JSON.stringify(value);
            localStorage.setItem(fullKey, serialized);
        }
    };
}
