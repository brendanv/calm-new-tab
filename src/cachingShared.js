// @flow

import localForage from 'localforage';
import LZString from 'lz-string';

const STORAGE_KEY = 'cachedImg';

async function saveToCache(dataUrl: string) {
  try {
    await localForage.clear();
    const val = await localForage.setItem(
      STORAGE_KEY,
      LZString.compressToUTF16(dataUrl),
    );
    console.log(`Cached image dataURL. ${val.length} characters.`);
  } catch (e) {
    console.error(e);
  }
}

async function getDataURLFromCache(): Promise<?string> {
  try {
    const val = await localForage.getItem(STORAGE_KEY);
    if (val != null) {
      console.log(`Loaded dataURL from cache. ${val.length} characters.`);
      return LZString.decompressFromUTF16(val);
    }
  } catch (e) {
    console.error(e);
  }
  return null;
}

module.exports = {
  saveToCache,
  getDataURLFromCache,
};
