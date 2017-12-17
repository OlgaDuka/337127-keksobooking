'use strict';
window.form = (function () {
  // =========================================================================
  // Константы и переменные
  // =========================================================================
  var OFFER_TYPES = ['flat', 'house', 'bungalo', 'palace'];
  var OFFER_CHECKS = ['12:00', '13:00', '14:00'];
  var formNotice = document.querySelector('.notice__form');
  var formFields = formNotice.querySelectorAll('fieldset');
  var titleHousing = formNotice.querySelector('#title');
  var typeHousing = formNotice.querySelector('#type');
  var priceHousing = formNotice.querySelector('#price');
  var timeInHousing = formNotice.querySelector('#timein');
  var timeOutHousing = formNotice.querySelector('#timeout');
  var roomNumberHousing = formNotice.querySelector('#room_number');
  var capacityHousing = formNotice.querySelector('#capacity');
  var features = formNotice.querySelectorAll('input[type="checkbox"]');
  var addressHousing = formNotice.querySelector('#address');
  var dropZoneImages = formNotice.querySelectorAll('.drop-zone');
  var avatarZone = dropZoneImages[0];
  var avatarUser = formNotice.querySelector('.notice__preview img');
  // var photoZone = dropZoneImages[1];
  // var photoHousing = formNotice.querySelector('.notice__preview img');

  // Вспомогательные объекты
  // Объект соответствия количества комнат количеству возможных гостей
  var capacityOfRoom = {
    1: ['1'],
    2: ['2', '1'],
    3: ['3', '2', '1'],
    100: ['0']
  };
  // Объект соответствия типов недвижимости и минимальной цены
  var offerTypePrice = {
    flat: 1000,
    bungalo: 0,
    house: 5000,
    palace: 10000
  };
  // Массив минимальных цен
  var arrMinPrices = OFFER_TYPES.map(function (elem) {
    return offerTypePrice[elem];
  });
  // =========================================================================
  // Функции
  // =========================================================================
  // Функция сброса полей формы в начальное состояние
  var resetForm = function () {
    titleHousing.value = '';
    titleHousing.placeholder = 'Милая, но очень уютная квартирка в центре Токио';
    addressHousing.value = window.pinMain.address;
    typeHousing.value = 'flat';
    priceHousing.value = '5000';
    timeInHousing.value = '12:00';
    timeOutHousing.value = '12:00';
    roomNumberHousing.value = '1';
    capacityHousing.value = '1';
    [].forEach.call(capacityHousing.options, function (element) {
      capacityOptionActivate(element);
    });
    [].forEach.call(features, function (element) {
      element.checked = false;
    });
  };
  // Функции обратного вызова для синхронизации значений полей формы
  var syncValues = function (element, value) {
    element.value = value;
  };
  var syncValueWithMin = function (element, value) {
    element.min = value;
  };
  // Функции для обработчиков событий
  // Выделение красным цветом рамки поля при ошибочном вводе
  var allocateBorderColor = function (element) {
    element.style.borderWidth = '2px';
    element.style.borderColor = 'red';
  };
  // Возвращение рамки в прежнее состояние
  var resetBorderColor = function (element) {
    element.style.borderWidth = '';
    element.style.borderColor = '';
  };
  // Для заголовка
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
    window.synchronizeFields(timeInHousing, timeOutHousing, OFFER_CHECKS, OFFER_CHECKS, syncValues);
  };
  // Автоввод времени въезда при изменении времени выезда
  var onChangeTimeOut = function () {
    window.synchronizeFields(timeOutHousing, timeInHousing, OFFER_CHECKS, OFFER_CHECKS, syncValues);
  };
  // Изменение минимальной стоимости жилья
  var onChangeType = function () {
    window.synchronizeFields(typeHousing, priceHousing, OFFER_TYPES, arrMinPrices, syncValueWithMin);
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
  // Функции включения-выключения вариантов количества гостей
  var capacityOptionActivate = function (element) {
    element.classList.remove('hidden');
  };
  var capacityOptionDeActivate = function (element) {
    element.classList.add('hidden');
  };
  // Изменение количества гостей в зависимости от изменения количества комнат
  var onChangeRoomNumber = function () {
    var arrGuests = capacityOfRoom[roomNumberHousing.value];
    [].forEach.call(capacityHousing.options, function (element) {
      if (arrGuests.includes(element.value)) {
        capacityOptionActivate(element);
      } else {
        capacityOptionDeActivate(element);
      }
    });
    capacityHousing.value = arrGuests[0];
  };
  // Изменение количества комнат, если первоначально изменение было в количестве гостей
  var onChangeCapacity = function () {
    var capacityValue = capacityHousing.value; // гостей - число
    if (capacityOfRoom[roomNumberHousing.value].includes(capacityValue)) {
      return;
    } else {
      for (var key in capacityOfRoom) {
        if (capacityOfRoom[key].includes(capacityValue)) {
          roomNumberHousing.value = key;
          onChangeRoomNumber();
          return;
        }
      }
    }
  };
  // Отправка формы на сервер
  var onSubmitForm = function (evt) {
    window.backend.save(new FormData(formNotice), resetForm, window.backend.onError);
    evt.preventDefault();
  };
  // Сохраняем перетаскиваемый файл
  var onAvatarZoneDrop = function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
    var fileName = evt.dataTransfer[0];
    evt.dataTransfer.dropEffect = 'copy';
    var imageLoader = new FileReader();
    // Слушаем событие окончания загрузки файла
    imageLoader.addEventListener('load', function () {
      avatarUser.src = imageLoader.result;
    });
    imageLoader.readAsDataURL(fileName);
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
  roomNumberHousing.addEventListener('change', onChangeRoomNumber);
  // Событие изменения количества гостей
  capacityHousing.addEventListener('change', onChangeCapacity);
  // Событие сброса файла с аватаркой в drop-зоне
  avatarZone.addEventListener('drop', onAvatarZoneDrop);
  // Событие отправки формы на сервер
  formNotice.addEventListener('submit', onSubmitForm);

  return {
    addressHousing: formNotice.querySelector('#address'),
    activate: function () {
      formNotice.classList.remove('notice__form--disabled');
      formFields.forEach(function (element) {
        element.removeAttribute('disabled', 'disabled');
      });
      addressHousing.value = window.pinMain.address;
    },
    init: function () {
      formFields.forEach(function (element) {
        element.setAttribute('disabled', 'disabled');
      });
      roomNumberHousing.value = '1';
      capacityHousing.value = '1';
    }
  };
})();
