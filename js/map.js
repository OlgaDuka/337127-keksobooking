'use strict';

// Константы
var keyCodes = {
  ESC: 27,
  NTER: 13
};
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
var MAX_PINS = 8;
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
  bungalo: 'Бунгало',
  palace: 'Дворец'
};
// Объект соответствия типов недвижимости
var offerTypePrice = {
  flat: 1000,
  bungalo: 0,
  house: 5000,
  palace: 10000
};
// Объект соответствия количества комнат количеству возможных гостей
var capacityOfRooms = {
  0: [2],
  1: [1, 2],
  2: [0, 1, 2],
  3: [3]
};

// Массив объектов недвижимости
var ads = [];
// Текущий маркер
var currentPin = false;
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
// Форма
var formNotice = document.querySelector('.notice__form');

// Функции:
// Получение случайного целого значения, включая minValue и исключая maxValue
var getRandomInt = function (minValue, maxValue) {
  return Math.floor(Math.random() * (maxValue - minValue)) + minValue;
};

// Строковые координаты маркера (со смещением по Y)
var pinStrX = function (x) {
  return x + 'px';
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
var renderMapPin = function (ad, i) {
  var mapPinElement = mapPinTemplate.cloneNode(true);
  mapPinElement.querySelector('img').src = ad.author.avatar;
  mapPinElement.style.left = pinStrX(ad.location.x);
  mapPinElement.style.top = pinStrY(ad.location.y);
  mapPinElement.dataset.numPin = i;
  fragment.appendChild(mapPinElement);
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

// =========================================================================
// События в процессе работы сайта
// =========================================================================

// Функции для обработки событий
// Начало работы - нажатие на центральный маркер
var onPageStartMouseUp = function () {
  // Активируем страницу - убираем затемнение
  mapStart.classList.remove('map--faded');
  // Добавляем маркеры на страницу
  pinsContainer.appendChild(fragment);
  // Активируем форму
  formNotice.classList.remove('notice__form--disabled');
};

// Сброс активного маркера
var pinDeactivate = function () {
  if (currentPin !== false) {
    currentPin.classList.remove('map__pin--active');
  }
};

// Реакция на нажатие ESC
var onPopupEscPress = function (evt) {
  if (evt.keyCode === keyCodes.ESC) {
    closePopup();
  }
};

// Закрыть карточку мышкой
var onCardCloseClick = function () {
  closePopup();
};

// Закрыть карточку с клавиатуры
var onCardCloseEnterPress = function (evt) {
  if (evt.keyCode === keyCodes.ENTER) {
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
  pinDeactivate();
  currentPin = false;
  document.removeEventListener('keydown', onPopupEscPress);
};

var onPinClick = function (evt) {
  var clickedElement = evt.target;
  while (clickedElement !== pinsContainer) {
    if (clickedElement.tagName === 'BUTTON') {
      pinDeactivate();
      clickedElement.classList.add('map__pin--active');
      currentPin = clickedElement;
      if (!clickedElement.classList.contains('map__pin--main')) {
        // Заполняем DOM-ноду карточки данными из массива объектов
        renderMapCard(ads[clickedElement.dataset.numPin]);
        openPopup();
      }
      return;
    }
    clickedElement = clickedElement.parentNode;
  }
};

// Обработка событий
// Делаем страницу доступной для работы пользователя
pinMain.addEventListener('mouseup', onPageStartMouseUp);
// Клик на маркер ловим на контейнере
pinsContainer.addEventListener('click', onPinClick);
// Закрытие карточки по нажатию мышки
mapCardClose.addEventListener('click', onCardCloseClick);
// Закрытие карточки с клавиатуры
mapCardClose.addEventListener('keydown', onCardCloseEnterPress);

// =====================================================================
// Валидациия формы
// =====================================================================
// Переменные
var titleHousing = formNotice.querySelector('#title');
var addressHousing = formNotice.querySelector('#address');
var typeHousing = formNotice.querySelector('#type');
var priceHousing = formNotice.querySelector('#price');
var timeInHousing = formNotice.querySelector('#timein');
var timeOutHousing = formNotice.querySelector('#timeout');
var roomNamberHousing = formNotice.querySelector('#room_number');
var capacityHousing = formNotice.querySelector('#capacity');

// Функции для обработчиков событий
// для заголовка
var onInvalidInput = function () {
  if (titleHousing.validity.tooShort) {
    titleHousing.setCustomValidity('Заголовок должен быть не менее 30-ти символов');
  } else if (titleHousing.validity.valueMissing) {
    titleHousing.setCustomValidity('Обязательное поле');
  } else {
    titleHousing.setCustomValidity('');
  }
};

// Автоввод времени выезда при изменении времени въезда
var onChangeTimeIn = function () {
  timeOutHousing.selectedIndex = timeInHousing.selectedIndex;
};
// Автоввод времени въезда при изменении времени выезда
var onChangeTimeOut = function () {
  timeInHousing.selectedIndex = timeOutHousing.selectedIndex;
};

// Изменение минимальной стоимости жилья
var onChangeType = function () {
  priceHousing.min = offerTypePrice[typeHousing.options[typeHousing.selectedIndex].value];
};

// Проверка введенной суммы на валидность
var onInvalidInputPrice = function () {
  if (priceHousing.validity.rangeUnderflow) {
    priceHousing.setCustomValidity('Стоимость жилья ниже рекомендованной');
  } else if (priceHousing.validity.rangeOverflow) {
    priceHousing.setCustomValidity('Стоимость жилья слишком высока');
  } else if (priceHousing.validity.valueMissing) {
    priceHousing.setCustomValidity('Обязательное поле');
  } else {
    priceHousing.setCustomValidity('');
  }
};

var capacityOptionActivate = function (i) {
  capacityHousing.options[i].classList.remove('hidden');
};

var capacityOptionDeActivate = function (i) {
  capacityHousing.options[i].classList.add('hidden');
};

// Изменение select количества гостей в зависимости от изменения количества комнат
var onChangeRoomNumber = function () {
  var lenCapacitySelectDef = capacityHousing.options.length;
  var arrCapacitySelect = capacityOfRooms[roomNamberHousing.selectedIndex];
  var lenCapacitySelect = arrCapacitySelect.length;
  for (var i = 0; i < lenCapacitySelectDef; i++) {
    capacityOptionActivate(i);
  }
  for (i = 0; i < lenCapacitySelectDef; i++) {
    var search = false;
    for (var j = 0; j < lenCapacitySelect; j++) {
      if (arrCapacitySelect[j] === i) {
        search = true;
        break;
      }
    }
    if (!search) {
      capacityOptionDeActivate(i);
    }
  }
  capacityHousing.selectedIndex = arrCapacitySelect[0];
};

// Проверка правильности заполнения формы
var onSubmitNotice = function (evt) {
// evt.preventDefault(); Не понимаю, что сюда надо писать, если все поля уже проверяются на этапе ввода данных.
};

// Обработчики событий
// проверка ввода заголовка
titleHousing.addEventListener('invalid', onInvalidInput);
// Событие изменения времени въезда
timeInHousing.addEventListener('change', onChangeTimeIn);
// Событие изменения времени выезда
timeOutHousing.addEventListener('change', onChangeTimeOut);
// Событие изменения типа жилья
typeHousing.addEventListener('change', onChangeType);
// Проверка ввода суммы стоимости за ночь
priceHousing.addEventListener('invalid', onInvalidInputPrice);
// Событие изменения количества комнат
roomNamberHousing.addEventListener('change', onChangeRoomNumber);
// Событие отправка формы
formNotice.addEventListener('submit', onSubmitNotice);

// =========================================================================
// Инициализация и начало работы
// =========================================================================
// Создаем и заполняем данными массив объектов недвижимости
ads = generateAds(MAX_PINS);
// Переносим данные из массива объектов во фрагмент с маркерами для вставки на страницу
ads.forEach(renderMapPin);
// Добавляем карточку недвижимости на страницу и скрываем ее
mapStart.appendChild(mapCard);
mapCard.classList.add('hidden');
addressHousing.value = 'Адрес маленькой лачуги на берегу Японского залива';
