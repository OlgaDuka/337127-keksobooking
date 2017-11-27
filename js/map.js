'use strict';

// Константы
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
var PIN_X = 46;
var PIN_Y = 62;

// Переменные:
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
// Объект соответствия типов недвижимости
var offerType = {
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало'
};
// Массив объектов недвижимости
var ads = [];
// Копия массива названий объектов недвижимости
var offerTitles = OFFER_TITLES.slice();
// Главная часть страницы документа
var mapStart = document.querySelector('.map');
// Оъект DOM, содержащий список маркеров
var pinsContainer = document.querySelector('.map__pins');
// Часть шаблона - маркер на карте Токио
var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
// Часть шаблона - карточка объекта недвижимости
var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');
//  Фрагмент документа, который формируется для вставки в документ
var fragment = document.createDocumentFragment();

// Функции:
// Получение случайного целого значения, включая minValue и исключая maxValue
var getRandomInt = function (minValue, maxValue) {
  return Math.floor(Math.random() * (maxValue - minValue)) + minValue;
};

// Вычисление смещения маркера относительно координат объекта недвижимости
var pinStrX = function (x) {
  return (x - PIN_X / 2) + 'px';
};

var pinStrY = function (y) {
  return (y - PIN_Y) + 'px';
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

// Подготовка строки для вставки списка удобств
var getStringFeatures = function (elem) {
  return '<li class="feature feature--' + elem + '"></li>';
};

// Создание массива объектов недвижимости
var generateAds = function (numberObj) {
  for (var i = 0; i < numberObj; i++) {
    var locationX = getRandomInt(coords.x.min, coords.x.max);
    var locationY = getRandomInt(coords.y.min, coords.y.max);
    ads[i] = {
      author: {
        avatar: 'img/avatars/user0' + +i + '.png',
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
  return ads;
};

// Формирование метки для объекта - заполнение данными из массива объектов
var renderMapPin = function (ad) {
  var mapPinElement = mapPinTemplate.cloneNode(true);
  mapPinElement.querySelector('img').src = ad.author.avatar;
  mapPinElement.style.left = pinStrX(ad.location.x);
  mapPinElement.style.top = pinStrY(ad.location.y);
  return mapPinElement;
};

// Формирование карточки объекта - заполнение данными из массива объектов
var renderMapCard = function (ad) {
  var mapCardElement = mapCardTemplate.cloneNode(true);
  var mapCardP = mapCardElement.querySelectorAll('p');
  var mapCardUl = mapCardElement.querySelector('.popup__features');

  mapCardElement.querySelector('h3').textContent = ad.offer.title;
  mapCardElement.querySelector('.popup__price').innerHTML = ad.offer.price + '&#x20bd;/ночь';
  mapCardElement.querySelector('small').textContent = ad.offer.address;
  mapCardElement.querySelector('h4').textContent = offerType[ad.offer.type];
  mapCardP[2].textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
  mapCardP[3].textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
  mapCardP[4].textContent = ad.offer.description;
  mapCardUl.innerHTML = '';
  mapCardUl.insertAdjacentHTML('afterBegin', ad.offer.features.map(getStringFeatures).join(' '));
  mapCardElement.appendChild(mapCardUl);
  return mapCardElement;
};

// Реализация
// Делаем страницу доступной для работы пользователя
mapStart.classList.remove('map--faded');

// Создаем и заполняем данными массив объектов недвижимости
ads = generateAds(MAX_PINS);
// Переносим данные из массива объектов во фрагмент с маркерами для вставки на страницу
ads.forEach(function (elem) {
  fragment.appendChild(renderMapPin(elem));
});
// Добавляем маркеры на страницу
pinsContainer.appendChild(fragment);

// Создаем новый пустой фрагмент
fragment = document.createDocumentFragment();
// Заполняем фрагмент данными из массива объектов для отрисовки первой карточки недвижимости
fragment.appendChild(renderMapCard(ads[0]));
// Добавляем карточку недвижимости на страницу
mapStart.appendChild(fragment);
