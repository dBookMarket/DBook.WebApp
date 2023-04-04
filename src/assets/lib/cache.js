import moment from 'moment';
import 'moment/locale/zh-cn'
const EXPIRE_KEY = '_expire';

class Cache {
  generateKey = (url, params) => {
    const sortedParams = Object.keys(params).sort().reduce((result, key) => {
      result[key] = params[key];
      return result;
    }, {});
    url += `${JSON.stringify(sortedParams)}`;
    return url;
  }
  // 默认两天的缓存
  set = (key, data, expired = 2, unit = 'day') => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      // [year, month, day, hour, minute, second, millisecond]
      localStorage.setItem(`${key}${EXPIRE_KEY}`, moment().add(expired, 'day').toISOString());
      return true;
    } catch (err) {
      console.log(err);
    }
  }

  get = (key) => {
    if (localStorage.getItem(key) != null) {
      const expiredKey = `${key}${EXPIRE_KEY}`;
      const expired = localStorage.getItem(expiredKey);
      if (expired && moment(expired).isBefore(moment())) {
        localStorage.removeItem(expiredKey);
        return null;
      } else {
        return JSON.parse(localStorage.getItem(key));
      }
    } else {
      return null
    }
  }

  remove = (key) => {
    try {
      const expiredKey = `${key}${EXPIRE_KEY}`;
      localStorage.removeItem(expiredKey);
      return localStorage.removeItem(key);
    } catch (err) {
      console.log(err);
    }
  }

  clear = () => {
    try {
      localStorage.clear();
    } catch (err) {
      console.log(err);
    }
  }
}

export default new Cache();
