'use strict';
window.pinMain = (function () {
  // =========================================================================
  // Константы
  // =========================================================================
  // Ограничения перемещения маркера по высоте
  var BorderY = {
    MIN: 100,
    MAX: 500
  };
  // Высота главного маркера
  var HEIGHT_MAIN_PIN = 65;
  // Высота хвостика главного маркера
  var HEIGHT_MAIN_TAIL = 22;
  // =========================================================================
  // Переменные
  // =========================================================================
  // Маркер в центре карты
  var pin = document.querySelector('.map__pin--main');
  // Контейнер, скрывающий карту
  var pinsoverlay = document.querySelector('.map__pinsoverlay');
  // ==========================================================================
  // Обработка событий
  // ==========================================================================
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
      pin.style.left = (pin.offsetLeft - shift.x) + 'px';
      if ((pin.offsetTop - shift.y) >= (BorderY.MIN - (HEIGHT_MAIN_PIN / 2 + HEIGHT_MAIN_TAIL)) && (pin.offsetTop - shift.y) <= (BorderY.MAX - (HEIGHT_MAIN_PIN / 2 + HEIGHT_MAIN_TAIL))) {
        pin.style.top = (pin.offsetTop - shift.y) + 'px';
      }
    };
    // Убираем слежение за событиями при отпускании мыши
    // и записываем координаты маркера в поле адреса формы
    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      window.form.setAddressHousing();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    // Обработаем события движения и отпускания мыши
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };
  // Перетаскиваем главный маркер
  pin.addEventListener('mousedown', onPinMainMousedown);

  // Экспортируем строку с координатами для ввода адреса в форму
  return {
    pinGlobal: pin,
    // Функция для определения координат острого кончика маркера
    getCoords: function () {
      var box = pin.getBoundingClientRect();
      var boxOverlay = pinsoverlay.getBoundingClientRect();
      return Math.round((box.left - boxOverlay.left + box.width / 2)) + ', ' + Math.round((box.bottom + pageYOffset + HEIGHT_MAIN_TAIL));
    }
  };
})();
