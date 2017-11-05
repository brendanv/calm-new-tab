// @flow

import localForage from 'localforage';
import LZString from 'lz-string';

const STORAGE_KEY = 'cachedImg';

export type CachedSrc = {
  dataUrl: string,
  cachedTime: number,
};

async function saveToCache(data: CachedSrc) {
  try {
    await localForage.clear();
    const val = await localForage.setItem(
      STORAGE_KEY,
      LZString.compressToUTF16(JSON.stringify(data)),
    );
    console.log(`Cached image dataURL. ${val.length} characters.`);
  } catch (e) {
    console.error(e);
  }
}

async function getDataURLFromCache(): Promise<?CachedSrc> {
  try {
    const val = await localForage.getItem(STORAGE_KEY);
    if (val != null) {
      console.log(`Loaded dataURL from cache. ${val.length} characters.`);
      return JSON.parse(LZString.decompressFromUTF16(val));
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
