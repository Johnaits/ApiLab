export default class Store {
    #storage;
    #prefix;

    constructor(prefix = 'apilab') {
        this.#prefix = prefix;
        this.#storage = window.localStorage;
    }

    setItem(key, value) {
        this.#storage.setItem(this.#prefix + key, JSON.stringify(value));
    }

    getItem(key) {
        const item = this.#storage.getItem(this.#prefix + key);
        return item ? JSON.parse(item) : null;
    }

    removeItem(key) {
        this.#storage.removeItem(this.#prefix + key);
    }
}