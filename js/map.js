'use strict';
(function () {
  // Переменные
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
  // Клик по маркеру
  var onPinClick = function (evt) {
    window.showCard.renderAndOpen(evt.target, ads, pinsContainer);
  };

  // Обработчики событий
  // Делаем страницу доступной для работы пользователя
  pinMain.addEventListener('mouseup', onPageStartMouseUp);
  // Клик на маркер ловим на контейнере
  pinsContainer.addEventListener('click', onPinClick);

  // =========================================================================
  // Инициализация и начало работы
  // =========================================================================
  // Создаем и заполняем данными массив объектов недвижимости
  ads = window.data.generateAds();
  // Переносим данные из массива объектов во фрагмент с маркерами для вставки на страницу
  ads.forEach(window.pin.render, fragmentPins);
  // Добавляем карточку недвижимости на страницу и скрываем ее
  mapStart.appendChild(window.showCard.renderAndOpen(pinMain, ads[0], pinsContainer));

})();
