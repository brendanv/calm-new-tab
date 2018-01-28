// @flow

import localForage from 'localforage';
import localDriver from 'localforage-webextensionstorage-driver/local';

import type {PhotoData} from './unsplash';

const STORAGE_KEY = 'cachedImg';

let localStorage = null;
function waitForStorage(): Promise<localForageInstance> {
  return new Promise((resolve, reject) => {
    if (localStorage != null) {
      resolve(localStorage);
    } else {
      localForage
        .defineDriver(localDriver)
        .then(() => {
          localForage.setDriver('webExtensionLocalStorage');
          localStorage = localForage.createInstance({
            name: 'cache',
          });
          resolve(localStorage);
        });
    }
  });
}

async function saveToCache(data: PhotoData) {
  const storage = await waitForStorage();
  await storage.setItem(STORAGE_KEY, data);
}

async function getPhotoDataFromCache(): Promise<?PhotoData> {
  const storage = await waitForStorage();
  try {
    const val = await storage.getItem(STORAGE_KEY);
    if (val != null) {
      return val;
    }
  } catch (e) {
    console.error(e);
  }
  return null;
}

async function clearPhotoCache(): Promise<void> {
  const storage = await waitForStorage();
  await storage.removeItem(STORAGE_KEY);
}

module.exports = {
  clearPhotoCache,
  saveToCache,
  getPhotoDataFromCache,
};
