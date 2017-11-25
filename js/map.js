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
// Переменные:
// Массив объектов недвижимости
var ads = [];
// Строка со списком удобств
var stringLi = '';
// Копия массива названий объектов недвижимости
var offerTitles = OFFER_TITLES.slice();
// Главная часть страницы документа
var mapStart = document.querySelector('.map');
// Оъект DOM, содержащий список маркеров
var listPins = document.querySelector('.map__pins');
// Часть шаблона - маркер на карте Токио
var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
// Часть шаблона - карточка объекта недвижимости
var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');
//  Фрагмент документа, который формируется для вставки в документ
var fragment = document.createDocumentFragment();

// Функции:
// Получение случайного целого значения
var getRandomInt = function (minValue, maxValue) {
  return Math.floor(Math.random() * (maxValue - minValue)) + minValue;
};
// Формирование массива удобств для каждого объекта недвижимости
var generateFeatures = function () {
  var offerFeatures = OFFER_FEATURES.slice();
  var lengthArrRandom = getRandomInt(3, offerFeatures.length);
  var newOfferFeatures = [];
  for (var i = 0; i <= lengthArrRandom; i++) {
    var indexRandom = getRandomInt(0, offerFeatures.length);
    newOfferFeatures[i] = offerFeatures.splice(indexRandom, 1);
  }
  return newOfferFeatures;
};
// Получение строки со списком удобств в соответствии с объектом для добавления в DOM
var stringFeaturesLi = function (elem) {
  stringLi += '<li class="feature feature--' + elem + '"></li>';
  return stringLi;
};
// Формирование метки для объекта - заполнение данными из массива объектов
var renderMapPin = function (ad) {
  var mapPinElement = mapPinTemplate.cloneNode(true);
  mapPinElement.querySelector('img').src = ad.author.avatar;
  mapPinElement.style.left = ad.location.x + 'px';
  mapPinElement.style.top = ad.location.y + 'px';
  return mapPinElement;
};
// Формирование карточки объекта - заполнение данными из массива объектов
var renderMapCard = function (ad) {
  var mapCardElement = mapCardTemplate.cloneNode(true);
  mapCardElement.querySelector('h3').textContent = ad.offer.title;
  mapCardElement.querySelector('.popup__price').innerHTML = ad.offer.price + '&#x20bd;/ночь';
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
  var mapCardUl = mapCardElement.querySelector('.popup__features');
  while (mapCardUl.firstChild) {
    mapCardUl.removeChild(mapCardUl.firstChild);
  }
  ad.offer.features.forEach(stringFeaturesLi);
  mapCardUl.insertAdjacentHTML('afterBegin', stringLi);
  mapCardElement.appendChild(mapCardUl);
  return mapCardElement;
};

// Реализация
// Делаем страницу доступной для работы пользователя
mapStart.classList.remove('map--faded');
// Заполняем данными массив объектов недвижимости
for (var i = 0; i < MAX_PINS; i++) {
  var locationX = getRandomInt(coords.x.min, coords.x.max);
  var locationY = getRandomInt(coords.y.min, coords.y.max);
  ads[i] = {
    author: {
      avatar: 'img/avatars/user0' + (i + 1) + '.png',
    },
    offer: {
      title: offerTitles.splice(getRandomInt(0, offerTitles.length), 1),
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
// Переносим данные из массива объектов во фрагмент с маркерами для вставки на страницу
for (i = 0; i < ads.length; i++) {
  fragment.appendChild(renderMapPin(ads[i]));
}
// Добавляем маркеры на страницу
listPins.appendChild(fragment);
// Создаем новый пустой фрагмент
fragment = document.createDocumentFragment();
// Заполняем фрагмент данными из массива объектов для отрисовки первой карточки недвижимости
fragment.appendChild(renderMapCard(ads[0]));
// Добавляем карточку недвижимости на страницу
mapStart.appendChild(fragment);
