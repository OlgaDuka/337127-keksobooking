'use strict';
(function () {
  // Константы
  // Коды для клавиатуры
  var keyCodes = {
    ESC: 27,
    ENTER: 13
  };

  // Переменные
  // Главная часть страницы документа
  var mapStart = document.querySelector('.map');
  // Маркер в центре карты
  var pinMain = mapStart.querySelector('.map__pin--main');

  // Часть шаблона - карточка объекта недвижимости
  var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');
  var mapCard = mapCardTemplate.cloneNode(true);
  var mapCardClose = mapCard.querySelector('.popup__close');
  // Оъект DOM, содержащий список маркеров
  var pinsContainer = mapStart.querySelector('.map__pins');
  //  Фрагмент документа, который формируется для вставки в документ
  var fragmentPins = document.createDocumentFragment();
  // Текущий маркер
  var currentPin = false;
  // Массив объектов недвижимости
  var ads = [];

  // =========================================================================
  // События в процессе работы сайта
  // =========================================================================

  // Функции для обработки событий

  // Начало работы - нажатие на центральный маркер
  var onPageStartMouseUp = function () {
    // Активируем страницу - убираем затемнение
    mapStart.classList.remove('map--faded');
    // Добавляем маркеры на страницу
    pinsContainer.appendChild(fragmentPins);
    // Активируем форму
    window.form.activate();
    window.form.addressHousing.value = window.pinMain.address;
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
  // Клик по маркеру
  var onPinClick = function (evt) {
    var clickedElement = evt.target;
    while (clickedElement !== pinsContainer) {
      if (clickedElement.tagName === 'BUTTON') {
        pinDeactivate();
        clickedElement.classList.add('map__pin--active');
        currentPin = clickedElement;
        if (!clickedElement.classList.contains('map__pin--main')) {
          // Заполняем DOM-ноду карточки данными из массива объектов
          window.card.render(mapCard, ads[clickedElement.dataset.numPin]);
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
  ads = window.data.generateAds();
  // Переносим данные из массива объектов во фрагмент с маркерами для вставки на страницу
  ads.forEach(window.pin.render, fragmentPins);
  // Добавляем карточку недвижимости на страницу и скрываем ее
  mapStart.appendChild(mapCard);
  mapCard.classList.add('hidden');

})();
