'use strict';
window.mapFilters = (function () {
  // Константы
  var SHOW_PIN = 5;
  // Переменные
  var arrDataTemp = [];
  var objValue = {
    typeValue: 'any',
    priceValue: 'any',
    roomsValue: 'any',
    guestsValue: 'any'
  };
  var filterForm = document.querySelector('.map__filters');
  var filterType = filterForm.querySelector('#housing-type');
  var filterPrice = filterForm.querySelector('#housing-price');
  var filterRooms = filterForm.querySelector('#housing-rooms');
  var filterGuests = filterForm.querySelector('#housing-guests');
  var pinsContainer = document.querySelector('.map__pins');
  // var filterFeatures = filterForm.querySelector('.housing-features');

  // Функция получения отфильтрованного массива данных
  var updateArrData = function (arr) {
    var fragment = document.createDocumentFragment();
    var arrFiltered = arr;
    if (objValue.typeValue !== 'any') {
      arrFiltered = arrFiltered.filter(function (elem) {
        return elem.offer.type === objValue.typeValue;
      });
    }
    switch (objValue.priceValue) {
      case 'any':
        break;
      case 'low':
        arrFiltered = arrFiltered.filter(function (elem) {
          return elem.offer.price <= 10000;
        });
        break;
      case 'high':
        arrFiltered = arrFiltered.filter(function (elem) {
          return elem.offer.price >= 50000;
        });
        break;
      case 'middle':
        arrFiltered = arrFiltered.filter(function (elem) {
          return (elem.offer.price > 10000) && (elem.offer.price < 50000);
        });
    }
    if (objValue.roomsValue !== 'any') {
      arrFiltered = arrFiltered.filter(function (elem) {
        return elem.offer.rooms === parseInt(objValue.roomsValue, 10);
      });
    }
    if (objValue.guestsValue !== 'any') {
      arrFiltered = arrFiltered.filter(function (elem) {
        return elem.offer.guests === parseInt(objValue.guestsValue, 10);
      });
    }
    if (arrFiltered.length > SHOW_PIN) {
      arrFiltered = arrFiltered.slice(0, SHOW_PIN);
    }
    // Формируем маркеры для отфильтрованного списка
    arrFiltered.forEach(window.pin.render, fragment);
    // Добавляем маркеры на страницу
    pinsContainer.innerHTML = '';
    pinsContainer.appendChild(fragment);
  };
  // Функции для обработки событий
  var onFilterTypeChange = function (evt) {
    objValue.typeValue = evt.target.value;
    updateArrData(arrDataTemp);
  };
  var onFilterPriceChange = function (evt) {
    objValue.priceValue = evt.target.value;
    updateArrData(arrDataTemp);
  };
  var onFilterRoomsChange = function (evt) {
    objValue.roomsValue = evt.target.value;
    updateArrData(arrDataTemp);
  };
  var onFilterGuestsChange = function (evt) {
    objValue.guestsValue = evt.target.value;
    updateArrData(arrDataTemp);
  };
  // Обработчики событий изменения селектов
  filterType.addEventListener('change', onFilterTypeChange);
  filterPrice.addEventListener('change', onFilterPriceChange);
  filterRooms.addEventListener('change', onFilterRoomsChange);
  filterGuests.addEventListener('change', onFilterGuestsChange);
  // Экспортируем функцию получения отфильтрованного массива данных
  return {
    sample: function (arr) {
      arrDataTemp = arr.slice();
      return arrDataTemp.slice(0, SHOW_PIN);
    }
  };
})();
