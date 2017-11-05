// @flow
import type {CachedSrc} from './cachingShared';

import moment from 'moment';
import {getRandomPhotoURL} from './flickr';
import {getDataURLFromCache, saveToCache} from './cachingShared';

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
      const data = ((val.data: any): ?CachedSrc);
      if (data == null) {
        await addNewBackground();
      } else if (Date.now() - PHOTO_TTL > data.cachedTime) {
        console.log('Cached photo is more than one day old. Refreshing.');
        await addNewBackground();
      } else {
        setBackgroundWithSrc(data.dataUrl, false);
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
  if (timeElem != null && currTime !== timeStr) {
    timeElem.textContent = currTime;
    timeStr = currTime;
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

  if (cachingWorker != null) {
    cachingWorker.postMessage(['cache', {
      dataUrl: canvas.toDataURL('image/png'),
      cachedTime: Date.now(),
    }]);
  } else {
    await saveToCache({
      dataUrl: canvas.toDataURL('image/png'),
      cachedTime: Date.now(),
    });
  }
}

async function addNewBackground() {
  const newURL = await getRandomPhotoURL();
  if (newURL == null) {
    console.error('unable to fetch new photo url');
    return;
  }
  setBackgroundWithSrc(newURL, true);
}

function setBackgroundWithSrc(src: string, isRemote: boolean) {
  const img = document.createElement('img');
  if (img == null) {
    return;
  }
  img.src = src;
  img.id = 'bgPhoto';
  if (isRemote) {
    img.crossOrigin = 'anonymous';
  }
  img.onload = async function() {
    const cover = document.getElementById('photoCover');
    if (cover != null) {
      cover.classList.add('hidden');
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
}

window.onload = initPage;
