// @flow

import localForage from 'localforage';
import syncDriver from 'localforage-webextensionstorage-driver/sync';

const SETTINGS_KEY = 'calmSettings';

let settingsStorage = null;

function waitUntilStorage(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (settingsStorage != null) {
      resolve();
    } else {
      localForage
        .defineDriver(syncDriver)
        .then(() => {
          localForage.setDriver('webExtensionSyncStorage');
          settingsStorage = localForage.createInstance({
            name: 'settings',
          });
          resolve();
        });
    }
  });
}


async function saveSettings(settings: {[key: string]: string}): Promise<void> {
  await waitUntilStorage();
  await settingsStorage.setItem(SETTINGS_KEY, settings);
}

async function getAllSettings(): Promise<?{[key: string]: string}> {
  await waitUntilStorage();
  return await settingsStorage.getItem(SETTINGS_KEY);
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
