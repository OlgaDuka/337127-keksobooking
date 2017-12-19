'use strict';
window.сard = (function () {
  // =========================================================================
  // Константы
  // =========================================================================
  // Коды для клавиатуры
  var KeyCodes = {
    ESC: 27,
    ENTER: 13
  };
  // =========================================================================
  // Переменные
  // =========================================================================
  // Часть шаблона - карточка объекта недвижимости
  var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');
  var mapCard = mapCardTemplate.cloneNode(true);
  var linkCardP = mapCard.querySelectorAll('p');
  var linkCardUl = mapCard.querySelector('.popup__features');
  var linkCardUlGallery = mapCard.querySelector('.popup__pictures');
  var mapCardClose = mapCard.querySelector('.popup__close');
  // Текущий маркер
  var currentPin = false;
  var OfferType = {
    flat: 'Квартира',
    bungalo: 'Лачуга',
    house: 'Дом',
    palace: 'Дворец'
  };
  // ==========================================================================
  // Функции
  // ==========================================================================
  // Подготовка строки для вставки списка удобств
  var getStringFeatures = function (element) {
    return '<li class="feature feature--' + element + '"></li>';
  };
  // Подготовка строки для вставки фотографий
  var getStringPictures = function (element) {
    return '<li><img src="' + element + '" width="40"></li>';
  };
  // Формируем карточку в ДОМ-дереве
  var render = function (elementData) {
    mapCard.querySelector('img').src = elementData.author.avatar;
    mapCard.querySelector('h3').textContent = elementData.offer.title;
    mapCard.querySelector('.popup__price').innerHTML = elementData.offer.price + '&#x20bd;/ночь';
    mapCard.querySelector('small').textContent = elementData.offer.address;
    mapCard.querySelector('h4').textContent = OfferType[elementData.offer.type];
    linkCardP[2].textContent = elementData.offer.rooms + ' комнаты для ' + elementData.offer.guests + ' гостей';
    linkCardP[3].textContent = 'Заезд после ' + elementData.offer.checkin + ', выезд до ' + elementData.offer.checkout;
    linkCardP[4].textContent = elementData.offer.description;
    linkCardUl.innerHTML = '';
    linkCardUl.insertAdjacentHTML('afterBegin', elementData.offer.features.map(getStringFeatures).join(' '));
    mapCard.appendChild(linkCardUl);
    linkCardUlGallery.innerHTML = '';
    linkCardUlGallery.insertAdjacentHTML('afterBegin', elementData.offer.photos.map(getStringPictures).join(' '));
    mapCard.appendChild(linkCardUlGallery);
    return mapCard;
  };

  // =========================================================================
  // Функции для обработки событий
  // =========================================================================
  // Сброс активного маркера
  var pinDeactivate = function () {
    if (currentPin !== false) {
      currentPin.classList.remove('map__pin--active');
    }
  };
  // Реакция на нажатие ESC
  var onPopupEscPress = function (evt) {
    if (evt.keyCode === KeyCodes.ESC) {
      closePopup();
    }
  };
  // Закрыть карточку мышкой
  var onCardCloseClick = function () {
    closePopup();
  };
  // Закрыть карточку с клавиатуры
  var onCardCloseEnterPress = function (evt) {
    if (evt.keyCode === KeyCodes.ENTER) {
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
  // =========================================================================
  // Обработчики событий
  // =========================================================================
  // Закрытие карточки по нажатию мышки
  mapCardClose.addEventListener('click', onCardCloseClick);
  // Закрытие карточки с клавиатуры
  mapCardClose.addEventListener('keydown', onCardCloseEnterPress);

  // Экспортируем функцию рисования и показа карточки
  return {
    renderAndOpen: function (element, pins) {
      var clickedElement = element;
      while (clickedElement !== pins) {
        if (clickedElement.tagName === 'BUTTON') {
          pinDeactivate();
          clickedElement.classList.add('map__pin--active');
          currentPin = clickedElement;
          if (!clickedElement.classList.contains('map__pin--main')) {
            render(window.mapFilters.filteredData[clickedElement.dataset.numPin]);
            openPopup();
          } else {
            mapCard.classList.add('hidden');
          }
        }
        clickedElement = clickedElement.parentNode;
      }
      return mapCard;
    }
  };
})();
