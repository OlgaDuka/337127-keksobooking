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
  // Массив объектов недвижимости
  var ads = [];
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
  // =========================================================================
  // Функции для обмена данными с сервером
  // =========================================================================
  // Данные успешно загружены
  var successHandler = function (arrData) {
    arrData.forEach(window.pin.render, fragmentPins);
    ads = arrData.slice();
    // Делаем страницу доступной для работы пользователя
    pinMain.addEventListener('mouseup', onPageStartMouseUp);
  };
  // Ошибка - выводим сообщение для пользователя
  var errorHandler = function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 5px auto; text-align: center; background-color: magenta; border: 2px solid black';
    node.style.position = 'absolute';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '30px';
    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };
  // =========================================================================
  // Инициализация и начало работы
  // =========================================================================
  // Загружаем данные с сервера
  window.backend.load(successHandler, errorHandler);
  // Добавляем карточку недвижимости на страницу и скрываем ее
  mapStart.appendChild(window.showCard.renderAndOpen(pinMain, ads[0], pinsContainer));
  // Клик на маркер ловим на контейнере
  pinsContainer.addEventListener('click', onPinClick);
})();
