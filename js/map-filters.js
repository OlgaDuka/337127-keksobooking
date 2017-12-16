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
  // Массив с функциями фильтров
  var arrFunctionFilters = [
    // Фильтр по типу жилья
    function (arr) {
      if (objValue.typeValue !== 'any') {
        arr = arr.filter(function (elem) {
          return elem.offer.type === objValue.typeValue;
        });
      }
      return arr;
    },
    // Фильтр по стоимости
    function (arr) {
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
    },
    // Фильтр по количеству комнат
    function (arr) {
      if (objValue.roomsValue !== 'any') {
        arr = arr.filter(function (elem) {
          return elem.offer.rooms === parseInt(objValue.roomsValue, 10);
        });
      }
      return arr;
    },
    // Фильтр по количеству гостей
    function (arr) {
      if (objValue.guestsValue !== 'any') {
        arr = arr.filter(function (elem) {
          return elem.offer.guests === parseInt(objValue.guestsValue, 10);
        });
      }
      return arr;
    },
    // Фильтр по удобствам
    function (arr) {
      for (var key in objChecked) {
        if (objChecked[key]) {
          arr = arr.filter(function (elem) {
            return findFeature(elem.offer.features, key);
          });
        }
      }
      return arr;
    }
  ];
  // Поиск удобства в объекте недвижимости
  var findFeature = function (arrFeatures, val) {
    return arrFeatures.some(function (arrVal) {
      return val === arrVal;
    });
  };
  // Обновляем контейнер с пинами в соответствии с фильтрами
  var updatePins = function (arr) {
    var arrFiltered = arr;
    arrFunctionFilters.forEach(function (elem) {
      arrFiltered = elem(arrFiltered);
    });
    // Обрезаем полученный массив до необходимой длинны
    if (arrFiltered.length > SHOW_PIN) {
      arrFiltered = arrFiltered.slice(0, SHOW_PIN);
    }
    window.mapFilters.filteredData = arrFiltered.slice();
    window.mapFilters.filteredData.forEach(window.pin.render, window.map.fragmentPins);
    window.debounce(window.map.appendPins);
  };

  // Функции для обработки событий изменения фильтров
  var onFilterTypeChange = function (evt) {
    objValue.typeValue = evt.target.value;
    updatePins(arrDataTemp);
  };
  var onFilterPriceChange = function (evt) {
    objValue.priceValue = evt.target.value;
    updatePins(arrDataTemp);
  };
  var onFilterRoomsChange = function (evt) {
    objValue.roomsValue = evt.target.value;
    updatePins(arrDataTemp);
  };
  var onFilterGuestsChange = function (evt) {
    objValue.guestsValue = evt.target.value;
    updatePins(arrDataTemp);
  };
  var onFilterFeaturesChange = function () {
    objChecked.wifi = filterWifi.checked;
    objChecked.dishwasher = filterDishwasher.checked;
    objChecked.parking = filterParking.checked;
    objChecked.washer = filterWasher.checked;
    objChecked.elevator = filterElevator.checked;
    objChecked.conditioner = filterConditioner.checked;
    updatePins(arrDataTemp);
  };
  // Обработчики событий изменения селектов
  filterType.addEventListener('change', onFilterTypeChange);
  filterPrice.addEventListener('change', onFilterPriceChange);
  filterRooms.addEventListener('change', onFilterRoomsChange);
  filterGuests.addEventListener('change', onFilterGuestsChange);
  filterFeatures.addEventListener('change', onFilterFeaturesChange);
  // Экспортируем функцию, принимающую массив данных с сервера,
  // и отфильтрованный массив данных
  return {
    filteredData: [],
    sample: function (arr) {
      arrDataTemp = arr.slice();
      this.filteredData = arr.slice();
      return arrDataTemp.slice(0, SHOW_PIN);
    },
  };
})();
