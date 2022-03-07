const storageKeyBase = 'sos';
type MaybeString = string | undefined;
export function migrate(newKey: string, oldKeys: string[], transform: (jsonValues: MaybeString[]) => string) {
    const fullNewKey = storageKeyBase + ':' + newKey;
    if (localStorage.getItem(fullNewKey) == null) {
        return;
    }

    const fullOldKeys = oldKeys.map(key => storageKeyBase + ':' + key);
    const jsonValues = fullOldKeys.map(key => (localStorage.getItem(key) || undefined));
    if (jsonValues.every(v => v === undefined)) {
        return;
    }

    const newJson = transform(jsonValues);
    if (newJson) {
        const fullNewKey = storageKeyBase + ':' + newKey;
        localStorage.setItem(fullNewKey, newJson);
        if (localStorage.getItem(fullNewKey) == newJson) {
            fullOldKeys.forEach(key => localStorage.removeItem(key));
        }
    }
}

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
            console.log('Saving', fullKey, serialized);
            localStorage.setItem(fullKey, serialized);
        }
    };
}
