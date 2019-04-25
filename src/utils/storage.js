const storage = window.localStorage;

export default {
  write(key, value) {
    storage.setItem(key, value);
  },
  read(key) {
    return storage.getItem(key);
  },
  delete(key) {
    storage.removeItem(key);
  },
  check(key) {
    return storage.getItem(key) !== null;
  },
  clear() {
    storage.clear();
  }
};
