const PREFIX = "books";

/**
 *
 * @param itemName
 */
export const get = itemName => {
  const item = localStorage.getItem(`${PREFIX}_${itemName}`);
  try {
    return item === null ? null : JSON.parse(item);
  } catch (e) {
    return null;
  }
};

/**
 *
 * @param itemName
 * @param itemValue
 */
// tslint:disable-next-line
export const set = (itemName, itemValue) => {
  localStorage.setItem(`${PREFIX}_${itemName}`, JSON.stringify(itemValue));
};

export const remove = itemName => {
  localStorage.removeItem(`${PREFIX}_${itemName}`);
};

export const clear = () => {
  Object.keys(localStorage).forEach(itemName => {
    localStorage.removeItem(itemName);
  });
};
