import localForage from 'localforage';
import moment from 'moment';

const defaultImg = 'https://c2.staticflickr.com/4/3712/10194610465_1e3d7c6d29_b.jpg';

async function initPage() {
  updateTime();
  window.setInterval(updateTime, 1000);

  const val = await localForage.getItem('cachedImg');
  if (val != null) {
    console.log(`Loaded dataURL from cache. ${val.length} characters.`);
    addBackgroundWithSrc(val, false);
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
  const dataURL = canvas.toDataURL('image/png');

  try {
    const val = await localForage.setItem('cachedImg', dataURL);
    console.log(`Cached image dataURL. ${val.length} characters.`);
  } catch (e) {
    console.error(e);
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
