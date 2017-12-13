'use strict';
window.pin = (function () {
  // Константы
  // Размер маркера по Y
  var PIN_Y = 46;
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

  // Экспортируем функцию формирования маркера
  return {
    render: function (objAd, i) {
      var mapPin = mapPinTemplate.cloneNode(true);
      mapPin.querySelector('img').src = objAd.author.avatar;
      mapPin.style.left = pinStrX(objAd.location.x);
      mapPin.style.top = pinStrY(objAd.location.y);
      mapPin.dataset.numPin = i;
      this.appendChild(mapPin);
      return this;
    }
  };
})();
