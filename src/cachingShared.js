// @flow

import localForage from 'localforage';
import LZString from 'lz-string';

import type {PhotoData} from './unsplash';

const STORAGE_KEY = 'cachedImg';

async function saveToCache(data: PhotoData) {
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

async function getDataURLFromCache(): Promise<?PhotoData> {
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
