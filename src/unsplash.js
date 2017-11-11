// @flow
import Unsplash, {toJson} from 'unsplash-js';

export type PhotoData = {
  src: string, // Either remote or data URL
  time: number,
  ownerName: string,
  ownerLink: string,
};

// I wish I knew a way to keep this secret...
const unsplash = new Unsplash({
  applicationId: 'app_id',
  secret: 'secret',
  callbackUrl: 'callback',
});

async function getRandomPhoto(): Promise<?PhotoData> {
  const result = await unsplash.photos.getRandomPhoto({
    collections: ['1379465'],
    orientation: 'landscape',
  });
  const json = await toJson(result);
  return {
    src: json.urls.regular, // TODO: maybe use a different size?
    time: Date.now(),
    ownerName: json.user.name,
    ownerLink: json.user.links.html,
  };
}

function utmify(baseUrl: string): string {
  return `${baseUrl}?utm_source=calm_new_tab&utm_medium=referral&utm_campaign=api-credit`;
}

module.exports = {
  getRandomPhoto,
  utmify,
};
