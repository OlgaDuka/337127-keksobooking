'use strict';
window.map = (function () {
  // Константы
  // Количество маркеров, одновременно располагаемых на карте
  var MAX_PINS = 8;
  // Коды для клавиатуры
  var keyCodes = {
    ESC: 27,
    ENTER: 13
  };

  // Переменные
  // Главная часть страницы документа
  var mapStart = document.querySelector('.map');
  // Массив объектов недвижимости
  var ads = [];
  // Маркер в центре карты
  var pinMain = mapStart.querySelector('.map__pin--main');
  // Часть шаблона - карточка объекта недвижимости
  var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');
  var mapCard = mapCardTemplate.cloneNode(true);
  var mapCardClose = mapCard.querySelector('.popup__close');
  // Оъект DOM, содержащий список маркеров
  var pinsContainer = mapStart.querySelector('.map__pins');
  // Текущий маркер
  var currentPin = false;

  // =========================================================================
  // События в процессе работы сайта
  // =========================================================================

  // Функции для обработки событий

  // Начало работы - нажатие на центральный маркер
  var onPageStartMouseUp = function () {
    // Активируем страницу - убираем затемнение
    mapStart.classList.remove('map--faded');
    // Добавляем маркеры на страницу
    pinsContainer.appendChild(window.data.fragmentPins);
    // Активируем форму
    window.form.classList.remove('notice__form--disabled');
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
          window.card.renderMapCard(mapCard, ads[clickedElement.dataset.numPin]);
          openPopup();
        }
        return;
      }
      clickedElement = clickedElement.parentNode;
    }
  };

  // Обработчики событий

  // Делаем страницу доступной для работы пользователя
  pinMain.addEventListener('mouseup', onPageStartMouseUp);
  // Клик на маркер ловим на контейнере
  pinsContainer.addEventListener('click', onPinClick);
  // Закрытие карточки по нажатию мышки
  mapCardClose.addEventListener('click', onCardCloseClick);
  // Закрытие карточки с клавиатуры
  mapCardClose.addEventListener('keydown', onCardCloseEnterPress);


  // =========================================================================
  // Инициализация и начало работы
  // =========================================================================
  // Создаем и заполняем данными массив объектов недвижимости
  ads = window.data.generateAds(ads, MAX_PINS);
  // Переносим данные из массива объектов во фрагмент с маркерами для вставки на страницу
  ads.forEach(window.pin.renderMapPin);
  // Добавляем карточку недвижимости на страницу и скрываем ее
  mapStart.appendChild(mapCard);
  mapCard.classList.add('hidden');

})();
