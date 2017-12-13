'use strict';
window.mapFilters = (function () {
  // Константы
  var SHOW_PIN = 5;
  // Переменные
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
  // var filterFeatures = filterForm.querySelector('.housing-features');
  // Функция получения отфильтрованного массива данных
  var updateArrData = function (arr) {
    var arrFiltered = arr;
    if (objValue.typeValue !== 'any') {
      arrFiltered = arrFiltered.filter(function (elem) {
        return elem.value === objValue.typeValue;
      });
    }
    switch (objValue.priceValue) {
      case 'any':
        break;
      case 'low':
        arrFiltered = arrFiltered.filter(function (elem) {
          return elem.value <= 10000;
        });
        break;
      case 'high':
        arrFiltered = arrFiltered.filter(function (elem) {
          return elem.value >= 50000;
        });
        break;
      case 'middle':
        arrFiltered = arrFiltered.filter(function (elem) {
          return (elem.value > 10000) && (elem.value < 50000);
        });
    }
    if (objValue.roomsValue !== 'any') {
      arrFiltered = arrFiltered.filter(function (elem) {
        return elem.value === objValue.roomsValue;
      });
    }
    if (objValue.guestsValue !== 'any') {
      arrFiltered = arrFiltered.filter(function (elem) {
        return elem.value === objValue.guestsValue;
      });
    }
    return arrFiltered.slice(0, SHOW_PIN);
  };
  // Функции для обработки событий
  var onFilterTypeChange = function (evt) {
    objValue.typeValue = evt.target.value;
  //  updateArrData();
  };
  var onFilterPriceChange = function (evt) {
    objValue.priceValue = evt.target.value;
  //  updateArrData();
  };
  var onFilterRoomsChange = function (evt) {
    objValue.roomsValue = evt.target.value;
  //  updateArrData();
  };
  var onFilterGuestsChange = function (evt) {
    objValue.guestsValue = evt.target.value;
  //  updateArrData();
  };
  // Обработчики событий изменения селектов
  filterType.addEventListener('change', onFilterTypeChange);
  filterPrice.addEventListener('change', onFilterPriceChange);
  filterRooms.addEventListener('change', onFilterRoomsChange);
  filterGuests.addEventListener('change', onFilterGuestsChange);
  // Экспортируем функцию получения отфильтрованного массива данных
  return {
    sample: function (arr) {
      return updateArrData(arr);
    }
  };
})();
