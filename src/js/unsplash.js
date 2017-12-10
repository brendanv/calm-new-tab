// @flow
import Unsplash, {toJson} from 'unsplash-js';
import {APPLICATION_ID, SECRET, CALLBACK_URL} from './API_KEYS';

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

async function getRandomPhoto(): Promise<?PhotoData> {
  const result = await unsplash.photos.getRandomPhoto({
    collections: ['1379465'],
    orientation: 'landscape',
    width: window.screen.width,
    height: window.screen.height,
  });
  const json = await toJson(result);
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
};
