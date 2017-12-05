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
    renderMapPin: function (objAd, i) {
      var mapPinElement = mapPinTemplate.cloneNode(true);
      mapPinElement.querySelector('img').src = objAd.author.avatar;
      mapPinElement.style.left = pinStrX(objAd.location.x);
      mapPinElement.style.top = pinStrY(objAd.location.y);
      mapPinElement.dataset.numPin = i;
      window.data.fragmentPins.appendChild(mapPinElement);
      return mapPinElement;
    }
  };
})();
