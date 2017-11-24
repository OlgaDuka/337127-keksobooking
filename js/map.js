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
var MAX_ROOMS = 6;
var MAX_GUESTS = 10;
var MIN_PRICE = 1000;
var MAX_PRICE = 1000000;
var MAX_PINS = 8;
var coords = {
  x: {
    min: 300,
    max: 900
  },
  y: {
    min: 100,
    max: 500
  }
};

var offerTitles = OFFER_TITLES.slice();
var getRandomValueForArr = function (arr) {
  return Math.floor(Math.random() * (arr.length));
};

var getRandomInt = function (minValue, maxValue) {
  return Math.floor(Math.random() * (maxValue - minValue)) + minValue;
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

for (var i = 0; i < MAX_PINS; i++) {
  var locationX = getRandomInt(coords.x.min, coords.x.max);
  var locationY = getRandomInt(coords.y.min, coords.y.max);
  ads[i] = {
    author: {
      avatar: 'img/avatars/user0' + (i + 1) + '.png',
    },
    offer: {
      title: generateTitle(offerTitles),
      address: locationX + ', ' + locationY,
      price: getRandomInt(MIN_PRICE, MAX_PRICE),
      type: OFFER_TYPES[getRandomInt(0, 3)],
      rooms: getRandomInt(1, MAX_ROOMS),
      guests: getRandomInt(1, MAX_GUESTS),
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
  mapPinElement.style.left = ad.location.x + 'px';
  mapPinElement.style.top = ad.location.y + 'px';
  return mapPinElement;
};

var fragment = document.createDocumentFragment();
for (i = 0; i < ads.length; i++) {
  fragment.appendChild(renderMapPin(ads[i]));
}
listPins.appendChild(fragment);

var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');

var renderMapCard = function (ad) {
  var mapCardElement = mapCardTemplate.cloneNode(true);
  mapCardElement.querySelector('h3').textContent = ad.offer.title;
  //  mapCardElement.querySelector('popup__price').textContent = toString(ad.offer.price) + '&#x20bd;/ночь';
  mapCardElement.querySelector('small').textContent = ad.offer.address;
  switch (ad.offer.type) {
    case 'flat':
      mapCardElement.querySelector('h4').textContent = 'Квартира';
      break;
    case 'bungalo':
      mapCardElement.querySelector('h4').textContent = 'Бунгало';
      break;
    case 'house':
      mapCardElement.querySelector('h4').textContent = 'Дом';
  }
  var mapCardP = mapCardElement.querySelectorAll('p');
  mapCardP[2].textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
  mapCardP[3].textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
  mapCardP[4].textContent = ad.offer.description;
  // mapCardElement.querySelector('.popup__features') - тут будет формироваться список. Отдельной функцией лучше?
  return mapCardElement;
};

fragment = document.createDocumentFragment();
fragment.appendChild(renderMapCard(ads[0]));
mapStart.appendChild(fragment);
