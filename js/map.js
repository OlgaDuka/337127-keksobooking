'use strict';
(function () {
  // =========================================================================
  // Переменные
  // =========================================================================
  // Главная часть страницы документа
  var mapStart = document.querySelector('.map');
  // Маркер в центре карты
  var pinMain = mapStart.querySelector('.map__pin--main');
  // Оъект DOM, содержащий список маркеров
  var pinsContainer = mapStart.querySelector('.map__pins');
  //  Фрагмент документа, который формируется для вставки в документ
  var fragmentPins = document.createDocumentFragment();
  //
  var filterHousing = document.querySelector('.map__filters');
  // Массив объектов недвижимости
  var ads = [];
  var arrDataTemp = [];
  // =========================================================================
  // Функции
  // =========================================================================
  // Функция очистки контейнера с маркерами
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
    pinsContainer.appendChild(fragmentPins);
    // Активируем форму
    window.form.activate();
    window.form.addressHousing.value = window.pinMain.address;
  };
  // Клик по маркеру
  var onPinClick = function (evt) {
    window.showCard.renderAndOpen(evt.target, ads, pinsContainer);
  };
  // Событие изменения фильтра
  var onFilterHousingClick = function () {
    ads = window.mapFilters.updateData(arrDataTemp);
    // Формируем маркеры для отфильтрованного списка
    ads.forEach(window.pin.render, fragmentPins);
    // Очищаем контейнер с пинами от предыдущего результата
    clearPinsContainer();
    // Добавляем маркеры на страницу
    pinsContainer.appendChild(fragmentPins);
  };

  // =========================================================================
  // Функция обратного вызова для обмена данными с сервером
  // =========================================================================
  // Данные успешно загружены
  var successHandler = function (arrData) {
    arrDataTemp = arrData.slice();
    ads = window.mapFilters.sample(arrData);
    ads.forEach(window.pin.render, fragmentPins);
    // Делаем страницу доступной для работы пользователя
    pinMain.addEventListener('mouseup', onPageStartMouseUp);
  };
  // =========================================================================
  // Инициализация и начало работы
  // =========================================================================
  // Загружаем данные с сервера
  window.backend.load(successHandler, window.backend.errorHandler);
  // Добавляем карточку недвижимости на страницу и скрываем ее
  mapStart.appendChild(window.showCard.renderAndOpen(pinMain, ads[0], pinsContainer));
  // Клик на маркер ловим на контейнере
  pinsContainer.addEventListener('click', onPinClick);
  // Клик на фильтрах ловим на форме с фильтрами
  filterHousing.addEventListener('click', onFilterHousingClick);
})();
