import { connectedWords } from './Lists';

export function getRandomItems(count, items) {
  const randomItems = [];
  const set = new Set();

  for (let i = 0; i < count; ) {
    const randomPos = Math.floor(Math.random() * items.length);
    if (set.has(randomPos)) {
      continue;
    }

    randomItems.push(items[randomPos]);
    set.add(randomPos);
    i++;
  }

  return randomItems;
}

export const shuffleArrayRandomly = (items) => {
  const n = items.length;
  for (let i = 0; i < n; i++) {
    const idx = Math.floor(Math.random() * (n - i));

    // swap values
    const temp = items[n - i - 1];
    items[n - i - 1] = items[idx];
    items[idx] = temp;
  }

  return items;
};

export function getConnectedGroups(count = 4, groupSize = 2) {
  const connectedWordsGroup = connectedWords.get(groupSize);
  if (!connectedWordsGroup) {
    throw new Error(`Invalid group size: ${groupSize}`);
  }

  const randomItemsGroup = getRandomItems(count, connectedWordsGroup);
  const itemGroups = [];
  randomItemsGroup.forEach((group) => {
    itemGroups.push(new Set(group));
  });
  const allItems = shuffleArrayRandomly(randomItemsGroup.flat());

  return [itemGroups, allItems];
}

export function areItemsFromSingleGroup(itemGroups, selectedItems) {
  const group = itemGroups.find((group) => group.has(selectedItems[0]));

  if (!group) {
    return false;
  }

  return selectedItems.every((item) => group.has(item));
}
