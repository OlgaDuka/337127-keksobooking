'use strict';
window.map = (function () {
  // =========================================================================
  // Переменные
  // =========================================================================
  // Главная часть страницы документа
  var mapStart = document.querySelector('.map');
  // Маркер в центре карты
  var pinMain = mapStart.querySelector('.map__pin--main');
  // Оъект DOM, содержащий список маркеров
  var pinsContainer = mapStart.querySelector('.map__pins');
  // Массив объектов недвижимости
  var ads = [];
  // ========================================================================
  // Функции
  // ========================================================================
  // Очищаем контейнер с пинами от предыдущего результата
  var clearPinsContainer = function () {
    while (pinsContainer.childElementCount > 2) {
      pinsContainer.removeChild(pinsContainer.lastChild);
    }
  };
  // =========================================================================
  // Функции для обработки событий
  // =========================================================================
  // Начало работы - нажатие на центральный маркер
  var onPageStartMouseUp = function () {
    // Активируем страницу - убираем затемнение
    mapStart.classList.remove('map--faded');
    // Добавляем маркеры на страницу
    pinsContainer.appendChild(window.map.fragmentPins);
    // Активируем форму
    window.form.activate();
    window.form.addressHousing.value = window.pinMain.address;
  };
  // Клик по маркеру
  var onPinClick = function (evt) {
    window.showCard.renderAndOpen(evt.target, pinsContainer);
  };

  // =========================================================================
  // Функция обратного вызова для обмена данными с сервером
  // =========================================================================
  // Данные успешно загружены
  var successHandler = function (arrData) {
    ads = window.mapFilters.sample(arrData);
    ads.forEach(window.pin.render, window.map.fragmentPins);
    // Делаем страницу доступной для работы пользователя
    pinMain.addEventListener('mouseup', onPageStartMouseUp);
  };
  // =========================================================================
  // Инициализация и начало работы
  // =========================================================================
  // Загружаем данные с сервера
  window.backend.load(successHandler, window.backend.errorHandler);
  // Добавляем карточку недвижимости на страницу и скрываем ее
  mapStart.appendChild(window.showCard.renderAndOpen(pinMain, pinsContainer));
  // Клик на маркер ловим на контейнере
  pinsContainer.addEventListener('click', onPinClick);

  return {
    //  Фрагмент документа, который формируется для вставки в документ
    fragmentPins: document.createDocumentFragment(),
    // Добавляем маркеры на страницу
    appendPins: function () {
      clearPinsContainer();
      pinsContainer.appendChild(window.map.fragmentPins);
    }
  };
})();
