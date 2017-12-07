'use strict';
(function () {
  // Константы
  // Ограничения перемещения маркера по высоте
  var borderY = {
    min: 100,
    max: 500
  };
  var hMainPin = 70;
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

  // Функция для определения координат элемента
  var getCoords = function (elem) {
    var box = elem.getBoundingClientRect();
    return (box.left + pageXOffset) + 'px, ' + (box.top + pageYOffset) + 'px';
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
    pinsContainer.appendChild(fragmentPins);
    // Активируем форму
    window.form.activate();
    window.form.addressHousing.value = getCoords(pinMain);
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
  // Перетаскиваем центральный маркер
  var onPinMainMousedown = function (evt) {
    evt.preventDefault();
    // Начальные координаты
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };
    // Отслеживаем перемещение мыши
    document.addEventListener('moveEvt', onMouseMove);
    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };
      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };
      pinMain.style.left = (pinMain.offsetLeft - shift.x) + 'px';
      if ((pinMain.offsetTop - shift.y) >= (borderY.min - hMainPin) && (pinMain.offsetTop - shift.y) <= (borderY.max - hMainPin)) {
        pinMain.style.top = (pinMain.offsetTop - shift.y) + 'px';
      }
    };
    // Убираем слежение за событиями при отпускании мыши
    // и записываем координаты маркера в поле адреса формы
    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      if (pinMain.style.left) {
        window.form.addressHousing.value = pinMain.style.left + ', ' + (parseInt(pinMain.style.top, 10) + hMainPin) + 'px';
      }
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    // Обработаем события движения и отпускания мыши
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
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
  // Перетаскиваем главный маркер
  pinMain.addEventListener('mousedown', onPinMainMousedown);

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
