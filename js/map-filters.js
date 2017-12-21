'use strict';
/* Уважаемый наставник,
прошу обратить Ваше внимание на то, что во всех модулях
проекта для ограничения глобальной области видимости от лишних переменных и
функций, которые нужны только внутри модулей, используются функции IIFE.
На лекции нам давали два варианта синтаксиса для использования этих функций.
Модули в глобальной области видны все. Иначе невозможна их работа.
К данным модуля мы обращаемся как window.имя-модуля.переменная-или-функция
И как мы напишем, по 1 или 2 варианту

1. window.имя-модуля = (function() {
тело модуля
return {
тут то, что экспортируем
};
}) ();

2. (function () {
тело модуля
window.имя-модуля = {
тут то, что экспортируем
};
}) ();

разницы нет. В любом варианте модуль обернут в IIFE и наружу ничего не видно,
кроме того, что мы запишем в объект для экспорта.
Посмотрите еще раз, пожалуйста. Все модули завернуты в IIFE-функции.

P.S. Игорь Алексеенко признал, что модули написаны правильно, но попросил
переписать на вариант синтаксиса, принятый в Академии за основной.
В дальнейшем пообещал точнее сформулировать критерий. Так что я переделала.
А вариант, который был, вы можете еще раз посмотреть в предыдущем архиве.
*/
(function () {
  // ==========================================================================
  // Константы и переменные
  // =========================================================================
  var SHOW_PIN = 5;
  // Рабочая копия массива полученных с сервера данных
  var dataCopy = [];
  // объект c текущими значениями фильтров
  var filterValue = {
    type: 'any',
    price: 'any',
    rooms: 'any',
    guests: 'any'
  };
  // Отмеченные пользователем удобства
  var checkedFeatures = [];
  // Фильтры
  var filterForm = document.querySelector('.map__filters');
  var filterType = filterForm.querySelector('#housing-type');
  var filterPrice = filterForm.querySelector('#housing-price');
  var filterRooms = filterForm.querySelector('#housing-rooms');
  var filterGuests = filterForm.querySelector('#housing-guests');
  var filterFeatures = filterForm.querySelector('#housing-features');
  // =========================================================================
  // Массив с функциями фильтров
  // =========================================================================
  var filterFunctions = [
    // Фильтр по типу жилья
    function (arr) {
      if (filterValue.type !== 'any') {
        arr = arr.filter(function (element) {
          return element.offer.type === filterValue.type;
        });
      }
      return arr;
    },
    // Фильтр по стоимости
    function (arr) {
      switch (filterValue.price) {
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
      if (filterValue.rooms !== 'any') {
        arr = arr.filter(function (element) {
          return element.offer.rooms === parseInt(filterValue.rooms, 10);
        });
      }
      return arr;
    },
    // Фильтр по количеству гостей
    function (arr) {
      if (filterValue.guests !== 'any') {
        arr = arr.filter(function (element) {
          return element.offer.guests === parseInt(filterValue.guests, 10);
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
  // =========================================================================
  var onFiltersChange = function (evt) {
    // Выставляем значение сработавшего фильтра в объекте текущих значений фильтров
    var filterName = evt.target.name.substring(8);
    filterValue[filterName] = evt.target.value;
    // Копируем исходные данные для фильтрования
    window.mapFilters.filteredData = dataCopy.slice();
    // Получаем список отмеченных чекбоксов
    var checkedElements = filterFeatures.querySelectorAll('input[type="checkbox"]:checked');
    // Преобразуем список в массив строк
    checkedFeatures = [].map.call(checkedElements, function (element) {
      return element.value;
    });
    // Получаем массив данных после обработки системой фильтров
    filterFunctions.forEach(function (getFiltered) {
      window.mapFilters.filteredData = getFiltered(window.mapFilters.filteredData);
    });
    // Обрезаем полученный массив до необходимой длинны
    if (window.mapFilters.filteredData.length > SHOW_PIN) {
      window.mapFilters.filteredData = window.mapFilters.filteredData.slice(0, SHOW_PIN);
    }
    // Добавляем пины на страницу через установленный тайм-аут
    window.debounce(window.map.appendPins);
  };
  // ==========================================================================
  // Обработчики событий изменения фильтров
  // ==========================================================================
  filterType.addEventListener('change', onFiltersChange);
  filterPrice.addEventListener('change', onFiltersChange);
  filterRooms.addEventListener('change', onFiltersChange);
  filterGuests.addEventListener('change', onFiltersChange);
  filterFeatures.addEventListener('change', onFiltersChange);
  // ==========================================================================
  // Экспортируем функцию, принимающую массив данных с сервера,
  // и отфильтрованный массив данных
  // ==========================================================================
  window.mapFilters = {
    filteredData: [],
    transferData: function (data) {
      dataCopy = data.slice();
      this.filteredData = data.slice(0, SHOW_PIN);
    },
  };
})();
