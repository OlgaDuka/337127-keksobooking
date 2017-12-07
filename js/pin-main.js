'use strict';
window.pinMain = (function () {
  // Константы
  // Ограничения перемещения маркера по высоте
  var borderY = {
    min: 100,
    max: 500
  };
  // Высота главного маркера
  var HEIGHT_MAIN_PIN = 65;
  // Высота хвостика главного маркера
  var HEIGHT_MAIN_TAIL = 22;

  // Маркер в центре карты
  var pin = document.querySelector('.map__pin--main');
  var pinsoverlay = document.querySelector('.map__pinsoverlay');

  // Функция для определения координат острого кончика маркера
  var getCoords = function (elem, container) {
    var box = elem.getBoundingClientRect();
    var boxOverlay = container.getBoundingClientRect();
    return Math.round((box.left - boxOverlay.left + box.width / 2)) + ', ' + Math.round((box.bottom + pageYOffset + HEIGHT_MAIN_TAIL));
  };

  // Обработка событий
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
      if ((pin.offsetTop - shift.y) >= (borderY.min - (HEIGHT_MAIN_PIN / 2 + HEIGHT_MAIN_TAIL)) && (pin.offsetTop - shift.y) <= (borderY.max - (HEIGHT_MAIN_PIN / 2 + HEIGHT_MAIN_TAIL))) {
        pin.style.top = (pin.offsetTop - shift.y) + 'px';
      }
    };
    // Убираем слежение за событиями при отпускании мыши
    // и записываем координаты маркера в поле адреса формы
    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      window.form.addressHousing.value = getCoords(pin, pinsoverlay);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    // Обработаем события движения и отпускания мыши
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };
  // Перетаскиваем главный маркер
  pin.addEventListener('mousedown', onPinMainMousedown);

  return {
    address: getCoords(pin, pinsoverlay)
  };

})();
