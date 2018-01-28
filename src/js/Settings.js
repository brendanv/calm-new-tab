// @flow

import type {localForageInstance} from 'localforage';

import localForage from 'localforage';
import syncDriver from 'localforage-webextensionstorage-driver/sync';

const SETTINGS_KEY = 'calmSettings';
const SETTINGS_VERSION = 1;

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


async function saveSettings(settings: {[key: string]: any}): Promise<void> {
  const storage = await waitForStorage();
  await storage.setItem(SETTINGS_KEY, {...settings, VERSION: SETTINGS_VERSION});
}

async function getAllSettings(): Promise<{[key: string]: any}> {
  const storage = await waitForStorage();
  const settings = await storage.getItem(SETTINGS_KEY);
  return settings == null ? {} : settings;
}

async function getSetting(settingName: string): Promise<?any> {
  const settings = await getAllSettings();
  return settings[settingName] || null;
}

async function bumpSettingsVersion(): Promise<void> {
  const settings = await getAllSettings();
  await saveSettings(settings);
}

module.exports = {
  bumpSettingsVersion,
  getAllSettings,
  getSetting,
  saveSettings,
  SETTINGS_VERSION,
};
