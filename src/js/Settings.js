// @flow

import type {localForageInstance} from 'localforage';

import localForage from 'localforage';
import syncDriver from 'localforage-webextensionstorage-driver/sync';

const SETTINGS_KEY = 'calmSettings';

let settingsStorage = null;

function waitForStorage(): Promise<localForageInstance> {
  return new Promise((resolve, reject) => {
    if (settingsStorage != null) {
      resolve(settingsStorage);
    } else {
      localForage
        .defineDriver(syncDriver)
        .then(() => {
          localForage.setDriver('webExtensionSyncStorage');
          settingsStorage = localForage.createInstance({
            name: 'settings',
          });
          resolve(settingsStorage);
        });
    }
  });
}


async function saveSettings(settings: {[key: string]: string}): Promise<void> {
  const storage = await waitForStorage();
  await storage.setItem(SETTINGS_KEY, settings);
}

async function getAllSettings(): Promise<?{[key: string]: string}> {
  const storage = await waitForStorage();
  return await storage.getItem(SETTINGS_KEY);
}

async function getSetting(settingName: string): Promise<?string> {
  const settings = await getAllSettings();
  if (settings != null) {
    return settings[settingName] || null;
  }
  return null;
}

module.exports = {
  getAllSettings,
  getSetting,
  saveSettings,
};
