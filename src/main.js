// @flow
import type {PhotoData} from './unsplash';

import moment from 'moment';
import {getRandomPhoto, utmify} from './unsplash';
import {getDataURLFromCache, saveToCache} from './cachingShared';
import Unsplash, {toJson} from 'unsplash-js';

const PHOTO_TTL = 24 * 60 * 60 * 1000; // 1 day in milliseconds

let cachingWorker = null;
if (window.Worker) {
  console.log('Initializing web worker');
  cachingWorker = new Worker('build/worker.js');
} else {
  console.warn('Unable to initialize web worker');
}

async function initPage() {
  updateTime();
  window.setInterval(updateTime, 1000);

  if (cachingWorker != null) {
    cachingWorker.onmessage = async function(val) {
      const data = ((val.data: any): ?PhotoData);
      if (data == null) {
        await addNewBackground();
      } else if (Date.now() - PHOTO_TTL > data.time) {
        console.log('Cached photo is more than one day old. Refreshing.');
        await addNewBackground();
      } else {
        setBackground(data, false);
      }
    };
    cachingWorker.postMessage(['retrieve']);
  } else {
    // TODO: this should attempt to load from cache on the main thread
    await addNewBackground();
  }
}

let timeStr = null;
function updateTime() {
  const currTime = moment().format('HH:mm');
  const timeElem = document.getElementById('time');
  const dateElem = document.getElementById('date');
  if (timeElem != null && currTime !== timeStr && dateElem != null) {
    timeElem.textContent = currTime;
    timeStr = currTime;

    // We want something similar to LLLL, but without the time.
    dateElem.textContent = moment().format(
      moment.localeData().longDateFormat('LLLL').replace(
        // Remove everything except for: day of week, date, month name, commas
        /[^dDo,M\s]/g,
        '',
      ).replace(
        // Trim any duplicate whitespace into a single space
        /\s+/g,
        ' ',
      ).replace(
        // Trim trailing whitespace or comma characters
        /[\s,]+$/,
        ''
      ),
    );
  }
}

async function cacheImage() {
  const img = document.getElementById('bgPhoto');
  const canvas = document.createElement('canvas');
  if (
    img == null ||
    canvas == null ||
    !(img instanceof HTMLImageElement)
  ) {
    return;
  }
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  canvas.getContext('2d').drawImage(img, 0, 0);

  const photoData = {
    src: canvas.toDataURL('image/png'),
    time: Number(img.dataset.time),
    ownerName: img.dataset.owner,
    ownerLink: img.dataset.ownerurl,
  };

  if (cachingWorker != null) {
    cachingWorker.postMessage(['cache', photoData]);
  } else {
    await saveToCache(photoData);
  }
}

async function addNewBackground() {
  const newPhoto = await getRandomPhoto();
  if (newPhoto == null) {
    console.error('unable to fetch new photo url');
    return;
  }
  setBackground(newPhoto, true);
}

function setBackground(photo: PhotoData, isRemote: boolean) {
  const img = document.createElement('img');
  if (img == null) {
    return;
  }
  img.src = photo.src;
  img.id = 'bgPhoto';
  if (isRemote) {
    img.crossOrigin = 'anonymous';
  }
  img.setAttribute('data-owner', photo.ownerName);
  img.setAttribute('data-ownerurl', photo.ownerLink);
  img.setAttribute('data-time', String(photo.time));
  img.onload = async function() {
    const body = document.body;
    if (body != null) {
      body.classList.remove('hidden');
    }
    if (isRemote) {
      await cacheImage();
    }
  }

  const wrapper = document.querySelector('.photo');
  if (wrapper == null) {
    return;
  }
  wrapper.appendChild(img);
  setAttributionLink(photo);
}

function setAttributionLink(photoData: PhotoData) {
  const attr = document.getElementById('attribution');
  const ownerLink = document.createElement('a');
  const unsplashLink = document.createElement('a');
  if (attr == null || ownerLink == null || unsplashLink == null) {
    return;
  }

  ownerLink.appendChild(document.createTextNode(photoData.ownerName));
  ownerLink.href = utmify(photoData.ownerLink);
  ownerLink.classList.add('text');

  unsplashLink.appendChild(document.createTextNode('Unsplash'));
  unsplashLink.href = utmify('https://unsplash.com');
  unsplashLink.classList.add('text');

  attr.appendChild(document.createTextNode('Photo by '));
  attr.appendChild(ownerLink);
  attr.appendChild(document.createTextNode(' / '));
  attr.appendChild(unsplashLink);
}

window.onload = initPage;
