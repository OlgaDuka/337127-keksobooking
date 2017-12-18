'use strict';
window.map = (function () {
  // =========================================================================
  // Переменные
  // =========================================================================
  // Главная часть страницы документа
  var mapCity = document.querySelector('.map');
  // Оъект DOM, содержащий список маркеров
  var pinsContainer = mapCity.querySelector('.map__pins');
  //  Фрагмент документа с маркерами для вставки в документ
  var pinsFragment = document.createDocumentFragment();
  // Массив объектов недвижимости
  var ads = [];
  // =========================================================================
  // Функции для обработки событий
  // =========================================================================
  // Начало работы - нажатие на центральный маркер
  var onPageStartMouseUp = function () {
    // Активируем страницу - убираем затемнение
    mapCity.classList.remove('map--faded');
    // Добавляем маркеры на страницу
    pinsContainer.appendChild(pinsFragment);
    // Активируем форму
    window.form.activate();
  };
  // Клик по маркеру
  var onPinClick = function (evt) {
    window.showCard.renderAndOpen(evt.target, pinsContainer);
  };

  // =========================================================================
  // Функция обратного вызова для обмена данными с сервером
  // =========================================================================
  // Данные успешно загружены
  var onSuccessLoad = function (data) {
    ads = window.mapFilters.transferData(data);
    ads.forEach(window.pin.render, pinsFragment);
    // Делаем страницу доступной для работы пользователя
    window.pinMain.pinGlobal.addEventListener('mouseup', onPageStartMouseUp);
  };
  // =========================================================================
  // Инициализация и начало работы
  // =========================================================================
  // Инициализация формы
  window.form.init();
  // Загружаем данные с сервера
  window.backend.load(onSuccessLoad, window.backend.onError);
  // Добавляем карточку недвижимости на страницу и скрываем ее
  mapCity.appendChild(window.showCard.renderAndOpen(window.pinMain.pinGlobal, pinsContainer));
  // Клик на маркер ловим на контейнере
  pinsContainer.addEventListener('click', onPinClick);

  return {
    // Функция добавления маркеров на страницу
    appendPins: function () {
      // Очищаем контейнер с маркерами от предыдущего результата
      window.util.clearContainer(pinsContainer, 2);
      // Заполняем фрагмент в соответствии с отфильтрованным массивом
      window.mapFilters.filteredData.forEach(window.pin.render, pinsFragment);
      // Добавляем фрагмент на страницу
      pinsContainer.appendChild(pinsFragment);
    }
  };
})();
