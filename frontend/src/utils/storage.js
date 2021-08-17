import Cookies from 'js-cookie';

const storage = {};

try {
  if (!window.localStorage) {
    throw Error('no local storage');
  }

  storage.set = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  storage.get = (key) => {
    const item = localStorage.getItem(key);
    try {
      return JSON.parse(item);
    } catch (e) {
      return null;
    }
  };
  storage.remove = key => localStorage.removeItem(key);
} catch (e) {
  storage.set = Cookies.set;
  storage.get = Cookies.getJSON;
  storage.remove = Cookies.remove;
}

export default storage;