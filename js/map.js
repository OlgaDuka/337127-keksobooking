'use strict';

// Константы
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;
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
// Массив маркеров
var mapPins = [];
// Копия массива названий объектов недвижимости
var offerTitles = OFFER_TITLES.slice();
// Главная часть страницы документа
var mapStart = document.querySelector('.map');
// Маркер в центре карты
var pinMain = mapStart.querySelector('.map__pin--main');
// Оъект DOM, содержащий список маркеров
var pinsContainer = mapStart.querySelector('.map__pins');
// Часть шаблона - маркер на карте Токио
var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
// Часть шаблона - карточка объекта недвижимости
var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');
var mapCard = mapCardTemplate.cloneNode(true);
var mapCardP = mapCard.querySelectorAll('p');
var mapCardUl = mapCard.querySelector('.popup__features');
var mapCardClose = mapCard.querySelector('.popup__close');
//  Фрагмент документа, который формируется для вставки в документ
var fragment = document.createDocumentFragment();
// Фрагмент для карточки
var fragmentCard = document.createDocumentFragment();
// Форма
var formNotice = document.querySelector('.notice__form');

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
  mapCard.querySelector('img').src = ad.author.avatar;
  mapCard.querySelector('h3').textContent = ad.offer.title;
  mapCard.querySelector('.popup__price').innerHTML = ad.offer.price + '&#x20bd;/ночь';
  mapCard.querySelector('small').textContent = ad.offer.address;
  mapCard.querySelector('h4').textContent = offerType[ad.offer.type];
  mapCardP[2].textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
  mapCardP[3].textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
  mapCardP[4].textContent = ad.offer.description;
  mapCardUl.innerHTML = '';
  mapCardUl.insertAdjacentHTML('afterBegin', ad.offer.features.map(getStringFeatures).join(' '));
  mapCard.appendChild(mapCardUl);
  return mapCard;
};

// Функции для обработки событий
var pageActive = function () {
  // Активируем страницу - убираем затемнение
  mapStart.classList.remove('map--faded');
  // Добавляем маркеры на страницу
  pinsContainer.appendChild(fragment);
  mapPins = pinsContainer.querySelectorAll('.map__pin');
  // Активируем форму
  formNotice.classList.remove('notice__form--disabled');
};

// Инициализация
// Создаем и заполняем данными массив объектов недвижимости
ads = generateAds(MAX_PINS);
// Переносим данные из массива объектов во фрагмент с маркерами для вставки на страницу
ads.forEach(function (elem) {
  fragment.appendChild(renderMapPin(elem));
});
// Заполняем фрагмент данными из массива объектов для отрисовки карточки
fragmentCard.appendChild(renderMapCard(ads[0]));
// Добавляем карточку недвижимости на страницу и скрываем ее
mapStart.appendChild(fragmentCard);
mapCard.classList.add('hidden');


// Реакция на нажатие ESC
var onPopupEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePopup();
  }
};
// Открыть карточку
var openPopup = function () {
  mapCard.classList.remove('hidden');
  document.addEventListener('keydown', onPopupEscPress);
};
// Закрыть карточку
var closePopup = function () {
  mapCard.classList.add('hidden');
  document.removeEventListener('keydown', onPopupEscPress);
};

// Обработчики событий
// Делаем страницу доступной для работы пользователя
pinMain.addEventListener('mouseup', function () {
  pageActive();
});

// Клик на маркер ловим на контейнере, target - img внутри кнопки
pinsContainer.addEventListener('click', function (evt) {
  var x = evt.target.parentNode.style.left;
  var y = evt.target.parentNode.style.top;
  var numPin = -1;

  for (var i = 0; i < mapPins.length; i++) {
    mapPins[i].classList.remove('map__pin--active');
    if ((x === mapPins[i].style.left) && (y === mapPins[i].style.top)) {
      numPin = i;
      evt.target.parentNode.classList.add('map__pin--active');
    }
  }
  if (numPin !== -1) {
    // Заполняем DOM-ноду карточки данными из массива объектов
    renderMapCard(ads[numPin - 1]);
    openPopup();
  }
});

// Закрытие карточки по нажатию мышки
mapCardClose.addEventListener('click', function () {
  closePopup();
});
// Закрытие карточки с клавиатуры
mapCardClose.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    closePopup();
  }
});
