'use strict';

var OFFER_TITLES = ['Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'];
var OFFER_TYPES = ['flat', 'house', 'bungalo'];
var OFFER_CHECKS = ['12:00', '13:00', '14:00'];
var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

var offerTitles = OFFER_TITLES.slice();

var getRandomValueForArr = function (arr) {
  return Math.floor(Math.random() * (arr.length));
};

var getRandomInt = function (minValue, maxValue) {
  return Math.floor(Math.random() * (maxValue - minValue)) + minValue;
};

var generateAvatar = function (numAvatar) {
  return 'img/avatars/user0' + numAvatar + '.png';
};

var generateTitle = function (arr) {
  var indexRandom = getRandomValueForArr(arr);
  return arr.splice(indexRandom, 1);
};

var generateFeatures = function () {
  var offerFeatures = OFFER_FEATURES.slice();
  var lengthArrRandom = getRandomValueForArr(offerFeatures);
  var newOfferFeatures = [];
  for (var i = 0; i < lengthArrRandom; i++) {
    var indexRandom = getRandomValueForArr(offerFeatures);
    newOfferFeatures[i] = offerFeatures.splice(indexRandom, 1);
  }
  return newOfferFeatures;
};

var ads = [];

for (var i = 0; i < 8; i++) {
  var locationX = getRandomInt(300, 900);
  var locationY = getRandomInt(100, 500);
  ads[i] = {
    author: {
      avatar: generateAvatar(i + 1)
    },
    offer: {
      title: generateTitle(offerTitles),
      address: locationX + ', ' + locationY,
      price: getRandomInt(1000, 1000000),
      type: OFFER_TYPES[getRandomInt(0, 3)],
      rooms: getRandomInt(1, 6),
      guests: getRandomInt(1, 10),
      checkin: OFFER_CHECKS[getRandomInt(0, 3)],
      checkout: OFFER_CHECKS[getRandomInt(0, 3)],
      features: generateFeatures(),
      description: '',
      photos: []
    },
    location: {
      x: locationX,
      y: locationY
    }
  };
}

var mapStart = document.querySelector('.map');
mapStart.classList.remove('map--faded');

var listPins = document.querySelector('.map__pins');
var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');

var renderMapPin = function (ad) {
  var mapPinElement = mapPinTemplate.cloneNode(true);
  mapPinElement.querySelector('img').src = ad.author.avatar;
  mapPinElement.querySelector('button').style.left = ad.location.x + 'px;';
  mapPinElement.querySelector('button').style.top = ad.location.y + 'px;';

  return mapPinElement;
};

var fragment = document.createDocumentFragment();
for (i = 0; i < ads.length; i++) {
  fragment.appendChild(renderMapPin(ads[i]));
}
listPins.appendChild(fragment);
