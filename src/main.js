// @flow
import type {PhotoData} from './flickr';

import moment from 'moment';
import {getRandomPhoto, attributionURL} from './flickr';
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

  const photoData = {
    src: canvas.toDataURL('image/png'),
    time: Number(img.dataset.time),
    owner: img.dataset.owner,
    ownername: img.dataset.ownername,
    title: img.dataset.title,
    id: img.dataset.id,
  }

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
  img.setAttribute('data-id', photo.id);
  img.setAttribute('data-owner', photo.owner);
  img.setAttribute('data-ownername', photo.ownername);
  img.setAttribute('data-title', photo.title);
  img.setAttribute('data-time', String(photo.time));
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
  setAttributionLink(photo);
}

function setAttributionLink(photoData: PhotoData) {
  const attr = document.getElementById('attribution');
  const link = document.createElement('a');
  if (attr == null || link == null) {
    return;
  }

  link.appendChild(document.createTextNode(`Photo by ${photoData.ownername}`));
  link.href = attributionURL(photoData);
  attr.appendChild(link);
}

window.onload = initPage;
