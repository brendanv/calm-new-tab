import {getDataURLFromCache, saveToCache} from './cachingShared';

onmessage = async function(message) {
  const {data} = message;

  // Filter out weird data that we don't care about
  if (!Array.isArray(data)) {
    return;
  }

  if (data.length === 2 && data[0] === 'cache') {
    await saveToCache(data[1]);
  } else if (data[0] === 'retrieve') {
    const val = await getDataURLFromCache();
    postMessage(val);
  }
}

