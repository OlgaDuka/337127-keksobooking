'use strict';
window.pin = (function () {
  // Константы
  // Размер маркера по Y
  var PIN_Y = 62;
  // Переменные
  // Часть шаблона - маркер на карте Токио
  var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');

  // Функции
  // Строковые координаты маркера (со смещением по Y)
  var pinStrX = function (x) {
    return x + 'px';
  };
  var pinStrY = function (y) {
    return (y - PIN_Y) + 'px';
  };

  // Формирование маркера - заполнение данными из массива объектов
  return {
    render: function (objAd, i) {
      var mapPin = mapPinTemplate.cloneNode(true);
      mapPin.querySelector('img').src = objAd.author.avatar;
      mapPin.style.left = pinStrX(objAd.location.x);
      mapPin.style.top = pinStrY(objAd.location.y);
      mapPin.dataset.numPin = i;
      window.data.fragmentPins.appendChild(mapPin);
      return mapPin;
    }
  };
})();
