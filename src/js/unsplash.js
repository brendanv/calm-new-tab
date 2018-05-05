// @flow
import Unsplash, {toJson} from 'unsplash-js';
import {APPLICATION_ID, SECRET, CALLBACK_URL} from './API_KEYS';
import {getSetting} from './Settings.js';

export type PhotoData = {
  type: 'remote' | 'local',
  src: string, // Either remote or data URL
  time: number,
  ownerName: string,
  ownerLink: string,
  location: ?string,
};

// I wish I knew a way to keep this secret...
const unsplash = new Unsplash({
  applicationId: APPLICATION_ID,
  secret: SECRET,
  callbackUrl: CALLBACK_URL,
});

const PEOPLE_COLLECTION_ID = '1658184';
const PLACES_COLLECTION_ID = '1658223';
const THINGS_COLLECTION_ID = '1658220';

async function getRandomPhoto(): Promise<?PhotoData> {
  let collections = await getSetting('collections');
  if (!Array.isArray(collections) || collections.length === 0) {
    collections = [
      PEOPLE_COLLECTION_ID,
      PLACES_COLLECTION_ID,
      THINGS_COLLECTION_ID,
    ];
  }
  const result = await unsplash.photos.getRandomPhoto({
    collections,
    orientation: 'landscape',
    width: window.screen.width,
    height: window.screen.height,
  });
  const json = await toJson(result);
  unsplash.photos.downloadPhoto(json);
  return {
    type: 'remote',
    src: json.urls.custom,
    time: Date.now(),
    ownerName: json.user.name,
    ownerLink: json.user.links.html,
    location: json.location ? json.location.title : null,
  };
}

function utmify(baseUrl: string): string {
  return `${baseUrl}?utm_source=calm_new_tab&utm_medium=referral&utm_campaign=api-credit`;
}

module.exports = {
  getRandomPhoto,
  utmify,
  PEOPLE_COLLECTION_ID,
  PLACES_COLLECTION_ID,
  THINGS_COLLECTION_ID,
};
