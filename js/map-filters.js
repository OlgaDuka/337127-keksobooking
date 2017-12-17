'use strict';
window.mapFilters = (function () {
  // ==========================================================================
  // Константы и переменные
  // =========================================================================
  var SHOW_PIN = 5;
  var arrDataTemp = [];
  var objValue = {
    typeValue: 'any',
    priceValue: 'any',
    roomsValue: 'any',
    guestsValue: 'any'
  };
  var checkedFeatures = [];
  var filterForm = document.querySelector('.map__filters');
  var filterType = filterForm.querySelector('#housing-type');
  var filterPrice = filterForm.querySelector('#housing-price');
  var filterRooms = filterForm.querySelector('#housing-rooms');
  var filterGuests = filterForm.querySelector('#housing-guests');
  var filterFeatures = filterForm.querySelector('#housing-features');
  // =========================================================================
  // Массив с функциями фильтров
  // =========================================================================
  var arrFunctionFilters = [
    // Фильтр по типу жилья
    function (arr) {
      if (objValue.typeValue !== 'any') {
        arr = arr.filter(function (element) {
          return element.offer.type === objValue.typeValue;
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
          arr = arr.filter(function (element) {
            return element.offer.price <= 10000;
          });
          break;
        case 'high':
          arr = arr.filter(function (element) {
            return element.offer.price >= 50000;
          });
          break;
        case 'middle':
          arr = arr.filter(function (element) {
            return (element.offer.price > 10000) && (element.offer.price < 50000);
          });
      }
      return arr;
    },
    // Фильтр по количеству комнат
    function (arr) {
      if (objValue.roomsValue !== 'any') {
        arr = arr.filter(function (element) {
          return element.offer.rooms === parseInt(objValue.roomsValue, 10);
        });
      }
      return arr;
    },
    // Фильтр по количеству гостей
    function (arr) {
      if (objValue.guestsValue !== 'any') {
        arr = arr.filter(function (element) {
          return element.offer.guests === parseInt(objValue.guestsValue, 10);
        });
      }
      return arr;
    },
    // Фильтр по удобствам
    function (arr) {
      return arr.filter(function (element) {
        return checkedFeatures.every(function (currentFeature) {
          return element.offer.features.includes(currentFeature);
        });
      });
    }
  ];
  // ==========================================================================
  // Функция фильтрации
  // ==========================================================================
  var updatePins = function (arr) {
    var arrFiltered = arr;
    // Получаем массив данных после обработки системой фильтров
    arrFunctionFilters.forEach(function (element) {
      arrFiltered = element(arrFiltered);
    });
    // Обрезаем полученный массив до необходимой длинны
    if (arrFiltered.length > SHOW_PIN) {
      arrFiltered = arrFiltered.slice(0, SHOW_PIN);
    }
    // Передаем полученный массив в глобальную область видимости
    window.mapFilters.filteredData = arrFiltered.slice();
    // Добавляем пины на страницу через установленный тайм-аут
    window.debounce(window.map.appendPins);
  };
  // =========================================================================
  // Функции для обработки событий изменения фильтров
  // =========================================================================
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
    // Получаем список отмеченных чекбоксов
    var checkedElements = filterFeatures.querySelectorAll('input[type="checkbox"]:checked');
    // Преобразуем список в массив строк
    checkedFeatures = [].map.call(checkedElements, function (element) {
      return element.value;
    });
    updatePins(arrDataTemp);
  };
  // ==========================================================================
  // Обработчики событий изменения фильтров
  // ==========================================================================
  filterType.addEventListener('change', onFilterTypeChange);
  filterPrice.addEventListener('change', onFilterPriceChange);
  filterRooms.addEventListener('change', onFilterRoomsChange);
  filterGuests.addEventListener('change', onFilterGuestsChange);
  filterFeatures.addEventListener('change', onFilterFeaturesChange);
  // ==========================================================================
  // Экспортируем функцию, принимающую массив данных с сервера,
  // и отфильтрованный массив данных
  // ==========================================================================
  return {
    filteredData: [],
    sample: function (arr) {
      arrDataTemp = arr.slice();
      this.filteredData = arr.slice();
      return arrDataTemp.slice(0, SHOW_PIN);
    },
  };
})();
