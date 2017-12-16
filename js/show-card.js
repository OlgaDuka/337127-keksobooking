'use strict';
window.showCard = (function () {
  // =========================================================================
  // Константы
  // =========================================================================
  // Коды для клавиатуры
  var keyCodes = {
    ESC: 27,
    ENTER: 13
  };
  // =========================================================================
  // Переменные
  // =========================================================================
  // Часть шаблона - карточка объекта недвижимости
  var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');
  var mapCard = mapCardTemplate.cloneNode(true);
  var mapCardClose = mapCard.querySelector('.popup__close');
  // Текущий маркер
  var currentPin = false;
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
  // =========================================================================
  // Обработчики событий
  // =========================================================================
  // Закрытие карточки по нажатию мышки
  mapCardClose.addEventListener('click', onCardCloseClick);
  // Закрытие карточки с клавиатуры
  mapCardClose.addEventListener('keydown', onCardCloseEnterPress);

  // Экспортируем функцию рисования и показа карточки
  return {
    renderAndOpen: function (elem, pins) {
      var clickedElement = elem;
      while (clickedElement !== pins) {
        if (clickedElement.tagName === 'BUTTON') {
          pinDeactivate();
          clickedElement.classList.add('map__pin--active');
          currentPin = clickedElement;
          if (!clickedElement.classList.contains('map__pin--main')) {
            window.card.render(mapCard, window.mapFilters.filteredData[clickedElement.dataset.numPin]);
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
