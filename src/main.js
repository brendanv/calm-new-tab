import moment from 'moment';

import {getDataURLFromCache, saveToCache} from './cachingShared';

const defaultImg = 'https://c2.staticflickr.com/4/3712/10194610465_1e3d7c6d29_b.jpg';

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
    cachingWorker.onmessage = (val) => {
      val.data == null
        ? addBackgroundWithSrc(defaultImg, true)
        : addBackgroundWithSrc(val.data, false);
    }
    cachingWorker.postMessage(['retrieve']);
  } else {
    addBackgroundWithSrc(defaultImg, true);
  }
}

let timeStr = null;
function updateTime() {
  const currTime = moment().format('HH:mm');
  if (currTime !== timeStr) {
    document.getElementById('time').textContent = currTime;
    timeStr = currTime;
  }
}

async function cacheImage() {
  const img = document.getElementById('bgPhoto');
  const canvas = document.createElement('canvas');
  if (img == null || canvas == null) {
    return;
  }
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  canvas.getContext('2d').drawImage(img, 0, 0);

  if (cachingWorker != null) {
    cachingWorker.postMessage(['cache', canvas.toDataURL('image/png')]);
  } else {
    await saveToCache(canvas.toDataURL('image/png'));
  }
}

function addBackgroundWithSrc(src, isRemote) {
  const img = document.createElement('img');
  if (img == null) {
    return;
  }
  img.src = src;
  img.id = 'bgPhoto';
  if (isRemote) {
    img.crossOrigin = 'anonymous';
    img.onload = cacheImage;
  }

  const wrapper = document.querySelector('.photo');
  if (wrapper == null) {
    return;
  }
  while (wrapper.firstChild) {
    wrapper.firstChild.remove();
  }
  wrapper.appendChild(img);
}

window.onload = initPage;
