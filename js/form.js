'use strict';
window.form = (function () {
  // =====================================================================
  // Валидациия формы
  // =====================================================================
  // Переменные
  // Форма
  var formNotice = document.querySelector('.notice__form');
  var titleHousing = formNotice.querySelector('#title');
  var typeHousing = formNotice.querySelector('#type');
  var priceHousing = formNotice.querySelector('#price');
  var timeInHousing = formNotice.querySelector('#timein');
  var timeOutHousing = formNotice.querySelector('#timeout');
  var roomNamberHousing = formNotice.querySelector('#room_number');
  var capacityHousing = formNotice.querySelector('#capacity');
  var addressHousing = formNotice.querySelector('#address');
  // Временное заполнение поля
  addressHousing.value = 'Адрес маленькой лачуги на берегу Японского залива';

  // Вспомогательные
  // Объект соответствия типов недвижимости
  var offerTypePrice = {
    flat: 1000,
    bungalo: 0,
    house: 5000,
    palace: 10000
  };
  // Объект соответствия количества комнат количеству возможных гостей
  var capacityOfRooms = {
    1: [1],
    2: [1, 2],
    3: [1, 2, 3],
    100: [0]
  };

  // Функции для обработчиков событий
  // Выделение красным цветом рамки поля при ошибочном вводе
  var allocateBorderColor = function (elem) {
    elem.style.borderWidth = '2px';
    elem.style.borderColor = 'red';
  };
  // Возвращение рамки в прежнее состояние
  var resetBorderColor = function (elem) {
    elem.style.borderWidth = '';
    elem.style.borderColor = '';
  };

  // для заголовка
  var onInvalidInput = function () {
    allocateBorderColor(titleHousing);
    if (titleHousing.validity.tooShort) {
      titleHousing.setCustomValidity('Заголовок должен быть не менее 30-ти символов');
    } else if (titleHousing.validity.tooLong) {
      titleHousing.setCustomValidity('Заголовок не должен превышать длинну в 100 символов');
    } else if (titleHousing.validity.valueMissing) {
      titleHousing.setCustomValidity('Обязательное поле');
    } else {
      titleHousing.setCustomValidity('');
      resetBorderColor(titleHousing);
    }
  };
  var onBlurInput = function (evt) {
    evt.target.checkValidity();
  };

  var onFocusInput = function (evt) {
    resetBorderColor(evt.target);
  };

  // Автоввод времени выезда при изменении времени въезда
  var onChangeTimeIn = function () {
    timeOutHousing.selectedIndex = timeInHousing.selectedIndex;
  };
  // Автоввод времени въезда при изменении времени выезда
  var onChangeTimeOut = function () {
    timeInHousing.value = timeOutHousing.value;
  };

  // Изменение минимальной стоимости жилья
  var onChangeType = function () {
    priceHousing.min = offerTypePrice[typeHousing.value];
  };

  // Проверка введенной суммы на валидность
  var onInvalidInputPrice = function () {
    allocateBorderColor(priceHousing);
    if (priceHousing.validity.rangeUnderflow) {
      priceHousing.setCustomValidity('Стоимость жилья ниже рекомендованной');
    } else if (priceHousing.validity.rangeOverflow) {
      priceHousing.setCustomValidity('Стоимость жилья слишком высока');
    } else {
      priceHousing.setCustomValidity('');
      resetBorderColor(priceHousing);
    }
  };
  // Измененная сумма удовлетворяет условиям
  var onChangePrice = function () {
    resetBorderColor(priceHousing);
    priceHousing.setCustomValidity('');
  };

  var capacityOptionActivate = function (elem) {
    elem.classList.remove('hidden');
  };

  var capacityOptionDeActivate = function (elem) {
    elem.classList.add('hidden');
  };

  // Изменение select количества гостей в зависимости от изменения количества комнат
  var onChangeRoomNumber = function () {
    var lenCapacitySelectDef = capacityHousing.options.length;
    var arrCapacitySelect = capacityOfRooms[roomNamberHousing.value];
    var lenCapacitySelect = arrCapacitySelect.length;
    [].forEach.call(capacityHousing.options, capacityOptionActivate);
    for (var i = 0; i < lenCapacitySelectDef; i++) {
      var search = false;
      for (var j = 0; j < lenCapacitySelect; j++) {
        if (arrCapacitySelect[j] === parseInt(capacityHousing.options[i].value, 10)) {
          search = true;
          break;
        }
      }
      if (!search) {
        capacityOptionDeActivate(capacityHousing.options[i]);
      }
    }
    capacityHousing.value = arrCapacitySelect[0];
  };

  // Обработчики событий
  // проверка ввода заголовка
  titleHousing.addEventListener('invalid', onInvalidInput);
  titleHousing.addEventListener('blur', onBlurInput);
  titleHousing.addEventListener('focus', onFocusInput);
  // Событие изменения времени въезда
  timeInHousing.addEventListener('change', onChangeTimeIn);
  // Событие изменения времени выезда
  timeOutHousing.addEventListener('change', onChangeTimeOut);
  // Событие изменения типа жилья
  typeHousing.addEventListener('change', onChangeType);
  // Проверка ввода суммы стоимости за ночь
  priceHousing.addEventListener('invalid', onInvalidInputPrice);
  priceHousing.addEventListener('change', onChangePrice);
  // Событие изменения количества комнат
  roomNamberHousing.addEventListener('change', onChangeRoomNumber);

  return {
    addressHousing: formNotice.querySelector('#address'),
    activate: function () {
      formNotice.classList.remove('notice__form--disabled');
    }
  };
})();
