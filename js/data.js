'use strict';
window.data = (function () {
  // Константы
  var OFFER_TITLES = ['Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'];
  var OFFER_TYPES = ['flat', 'house', 'bungalo', 'palace'];
  var OFFER_CHECKS = ['12:00', '13:00', '14:00'];
  var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var MAX_ROOMS = 6;
  var MAX_GUESTS = 10;
  var MIN_PRICE = 1000;
  var MAX_PRICE = 1000000;
  // Количество маркеров, одновременно располагаемых на карте
  var MAX_PINS = 8;

  // Переменные:
  // Массив объектов недвижимости
  var arrAds = [];
  // Объект с координатами размещения маркеров на карте
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
  // Копия массива названий объектов недвижимости
  var offerTitles = OFFER_TITLES.slice();

  // Функции:
  // Получение случайного целого значения, включая minValue и исключая maxValue
  var getRandomInt = function (minValue, maxValue) {
    return Math.floor(Math.random() * (maxValue - minValue)) + minValue;
  };

  // Формирование массива удобств для каждого объекта недвижимости
  var generateFeatures = function () {
    var offerFeatures = OFFER_FEATURES.slice();
    var lengthArrRandom = getRandomInt(Math.round(offerFeatures.length / 2), offerFeatures.length);
    var newOfferFeatures = [];
    for (var i = 0; i <= lengthArrRandom; i++) {
      var indexRandom = getRandomInt(0, offerFeatures.length);
      newOfferFeatures[i] = offerFeatures.splice(indexRandom, 1);
    }
    return newOfferFeatures;
  };
  return {
    // Объект соответствия типов недвижимости
    offerType: {
      flat: 'Квартира',
      house: 'Дом',
      bungalo: 'Бунгало',
      palace: 'Дворец'
    },
    // Создание массива объектов недвижимости
    generateAds: function () {
      for (var i = 0; i < MAX_PINS; i++) {
        var locationX = getRandomInt(coords.x.min, coords.x.max);
        var locationY = getRandomInt(coords.y.min, coords.y.max);
        arrAds[i] = {
          author: {
            avatar: 'img/avatars/user0' + (i + 1) + '.png',
          },
          offer: {
            title: offerTitles.splice(getRandomInt(0, offerTitles.length), 1),
            address: locationX + ', ' + locationY,
            price: getRandomInt(MIN_PRICE, MAX_PRICE),
            type: OFFER_TYPES[getRandomInt(0, OFFER_TYPES.length)],
            rooms: getRandomInt(1, MAX_ROOMS),
            guests: getRandomInt(1, MAX_GUESTS),
            checkin: OFFER_CHECKS[getRandomInt(0, OFFER_CHECKS.length)],
            checkout: OFFER_CHECKS[getRandomInt(0, OFFER_CHECKS.length)],
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
      return arrAds;
    }
  };
})();
