const apiKey = 'API_KEY';
const groupId = '52240257802%40N01'; // Long Exposure
const perPage = 50;
const base = 'https://api.flickr.com/services/rest/?method=flickr.groups.pools.getPhotos'

async function getRandomPhotoURL() {
  // Assume the group updates frequently so just pick from the most recent...
  const json = await getFlickrPhotosForPage(1);
  const photoArr = json.photos.photo;
  if (!Array.isArray(photoArr)) {
    return null;
  }
  const item = photoArr[Math.floor(Math.random() * photoArr.length)];
  return photoURL(item.farm, item.server, item.id, item.secret, 'h');
}

async function getFlickrPhotosForPage(pageNum) {
  const url = groupQueryURL(pageNum);
  const json = await flickrAPIRequest(url);
  return json;
}

async function flickrAPIRequest(url) {
  const response = await fetch(url);
  if (response.ok) {
    return response.json();
  }
  throw new Error('Fetch response not ok');
}

function groupQueryURL(pageNum) {
  return `${base}&api_key=${apiKey}&group_id=${groupId}&per_page=${perPage}&format=json&nojsoncallback=1&page=${pageNum}`;
}

function photoURL(farm, server, id, secret, size) {
  return `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}_${size}.jpg`;
}

module.exports = {
  getRandomPhotoURL,
}
