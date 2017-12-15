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
  var objChecked = {
    wifi: false,
    dishwasher: false,
    parking: false,
    washer: false,
    elevator: false,
    conditioner: false
  };
  var filterForm = document.querySelector('.map__filters');
  var filterType = filterForm.querySelector('#housing-type');
  var filterPrice = filterForm.querySelector('#housing-price');
  var filterRooms = filterForm.querySelector('#housing-rooms');
  var filterGuests = filterForm.querySelector('#housing-guests');
  var filterFeatures = filterForm.querySelector('#housing-features');
  var filterWifi = filterFeatures.querySelector('#filter-wifi');
  var filterDishwasher = filterFeatures.querySelector('#filter-dishwasher');
  var filterParking = filterFeatures.querySelector('#filter-parking');
  var filterWasher = filterFeatures.querySelector('#filter-washer');
  var filterElevator = filterFeatures.querySelector('#filter-elevator');
  var filterConditioner = filterFeatures.querySelector('#filter-conditioner');

  // Функции
  // Фильтр по типу жилья
  var filterTypeHousing = function (arr) {
    if (objValue.typeValue !== 'any') {
      arr = arr.filter(function (elem) {
        return elem.offer.type === objValue.typeValue;
      });
    }
    return arr;
  };
  // Фильтр по стоимости
  var filterPriceHousing = function (arr) {
    switch (objValue.priceValue) {
      case 'any':
        break;
      case 'low':
        arr = arr.filter(function (elem) {
          return elem.offer.price <= 10000;
        });
        break;
      case 'high':
        arr = arr.filter(function (elem) {
          return elem.offer.price >= 50000;
        });
        break;
      case 'middle':
        arr = arr.filter(function (elem) {
          return (elem.offer.price > 10000) && (elem.offer.price < 50000);
        });
    }
    return arr;
  };
  // Фильтр по количеству комнат
  var filterRoomsHousing = function (arr) {
    if (objValue.roomsValue !== 'any') {
      arr = arr.filter(function (elem) {
        return elem.offer.rooms === parseInt(objValue.roomsValue, 10);
      });
    }
    return arr;
  };
  // Фильтр по количеству гостей
  var filterGuestsHousing = function (arr) {
    if (objValue.guestsValue !== 'any') {
      arr = arr.filter(function (elem) {
        return elem.offer.guests === parseInt(objValue.guestsValue, 10);
      });
    }
    return arr;
  };
  // Фильтр по удобствам
  var filterFeaturesHousing = function (arr) {
    var filterSet = false;
    for (var key in objChecked) {
      if (objChecked[key]) {
        arr = arr.filter(function (elem) {
          filterSet = false;
          for (var i = 0; i < elem.offer.features.length; i++) {
            if (elem.offer.features[i] === key) {
              filterSet = true;
              break;
            }
          }
          return filterSet;
        });
      }
    }
    return arr;
  };

  // Функции для обработки событий изменения фильтров
  var onFilterTypeChange = function (evt) {
    objValue.typeValue = evt.target.value;
    window.mapFilters.updateData(arrDataTemp);
  };
  var onFilterPriceChange = function (evt) {
    objValue.priceValue = evt.target.value;
    window.mapFilters.updateData(arrDataTemp);
  };
  var onFilterRoomsChange = function (evt) {
    objValue.roomsValue = evt.target.value;
    window.mapFilters.updateData(arrDataTemp);
  };
  var onFilterGuestsChange = function (evt) {
    objValue.guestsValue = evt.target.value;
    window.mapFilters.updateData(arrDataTemp);
  };
  var onFilterFeaturesClick = function () {
    objChecked.wifi = filterWifi.checked;
    objChecked.dishwasher = filterDishwasher.checked;
    objChecked.parking = filterParking.checked;
    objChecked.washer = filterWasher.checked;
    objChecked.elevator = filterElevator.checked;
    objChecked.conditioner = filterConditioner.checked;
    window.mapFilters.updateData(arrDataTemp);
  };
  // Обработчики событий изменения селектов
  filterType.addEventListener('change', onFilterTypeChange);
  filterPrice.addEventListener('change', onFilterPriceChange);
  filterRooms.addEventListener('change', onFilterRoomsChange);
  filterGuests.addEventListener('change', onFilterGuestsChange);
  filterFeatures.addEventListener('click', onFilterFeaturesClick);
  // Экспортируем функцию получения отфильтрованного массива данных
  return {
    sample: function (arr) {
      arrDataTemp = arr.slice();
      return arrDataTemp.slice(0, SHOW_PIN);
    },
    updateData: function (arr) {
      var arrFiltered = arr;
      arrFiltered = filterTypeHousing(arrFiltered);
      arrFiltered = filterPriceHousing(arrFiltered);
      arrFiltered = filterRoomsHousing(arrFiltered);
      arrFiltered = filterGuestsHousing(arrFiltered);
      arrFiltered = filterFeaturesHousing(arrFiltered);
      // Обрезаем полученный массив до необходимой длинны
      if (arrFiltered.length > SHOW_PIN) {
        arrFiltered = arrFiltered.slice(0, SHOW_PIN);
      }
      return arrFiltered;
    }
  };
})();
