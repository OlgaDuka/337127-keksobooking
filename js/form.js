'use strict';
window.form = (function () {
  // =========================================================================
  // Константы и переменные
  // =========================================================================
  var OFFER_TYPES = ['flat', 'bungalo', 'house', 'palace'];
  var OFFER_CHECKS = ['12:00', '13:00', '14:00'];
  var MIN_PRICES = [1000, 0, 5000, 10000];
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
  var photoZone = dropZoneImages[1];
  var uploadPhotos = formNotice.querySelectorAll('.upload');

  // Вспомогательные объекты
  // Объект соответствия количества комнат количеству возможных гостей
  var CapacityOfRoom = {
    1: ['1'],
    2: ['2', '1'],
    3: ['3', '2', '1'],
    100: ['0']
  };
  // =========================================================================
  // Функции
  // =========================================================================
  // Функция сброса полей формы в начальное состояние
  var resetForm = function () {
    window.backend.removeError();
    titleHousing.value = '';
    titleHousing.placeholder = 'Милая, но очень уютная квартирка в центре Токио';
    window.form.setAddressHousing();
    typeHousing.value = 'flat';
    priceHousing.value = '5000';
    timeInHousing.value = '12:00';
    timeOutHousing.value = '12:00';
    roomNumberHousing.value = '1';
    capacityHousing.value = '1';
    [].forEach.call(capacityHousing.options, function (element) {
      activateCapacityOption(element);
    });
    [].forEach.call(features, function (element) {
      element.checked = false;
    });
    avatarUser.src = 'img/muffin.png';
    window.util.clearContainer(uploadPhotos[1], 2);
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
    element.style.borderColor = 'red';
  };
  // Возвращение рамки в прежнее состояние
  var resetBorderColor = function (element) {
    element.style.borderColor = '#d9d9d3';
  };
  // Для заголовка
  var onTitleInvalid = function () {
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
  var onTitleBlur = function (evt) {
    evt.target.checkValidity();
  };
  var onTitleFocus = function (evt) {
    resetBorderColor(evt.target);
  };
  // Автоввод времени выезда при изменении времени въезда
  var onTimeInChange = function () {
    window.util.synchronizeFields(timeInHousing, timeOutHousing, OFFER_CHECKS, OFFER_CHECKS, syncValues);
  };
  // Автоввод времени въезда при изменении времени выезда
  var onTimeOutChange = function () {
    window.util.synchronizeFields(timeOutHousing, timeInHousing, OFFER_CHECKS, OFFER_CHECKS, syncValues);
  };
  // Изменение минимальной стоимости жилья
  var onTypeChange = function () {
    window.util.synchronizeFields(typeHousing, priceHousing, OFFER_TYPES, MIN_PRICES, syncValueWithMin);
  };
  // Проверка введенной суммы на валидность
  var onPriceInvalid = function () {
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
  var onPriceChange = function () {
    resetBorderColor(priceHousing);
    priceHousing.setCustomValidity('');
  };
  // Функции включения-выключения вариантов количества гостей
  var activateCapacityOption = function (element) {
    element.classList.remove('hidden');
  };
  var deactivateCapacityOption = function (element) {
    element.classList.add('hidden');
  };
  // Изменение количества гостей в зависимости от изменения количества комнат
  var onRoomNumberChange = function () {
    var arrGuests = CapacityOfRoom[roomNumberHousing.value];
    [].forEach.call(capacityHousing.options, function (element) {
      if (arrGuests.includes(element.value)) {
        activateCapacityOption(element);
      } else {
        deactivateCapacityOption(element);
      }
    });
    capacityHousing.value = arrGuests[0];
  };
  // Изменение количества комнат, если первоначально изменение было в количестве гостей
  var onCapacityChange = function () {
    var capacityValue = capacityHousing.value; // гостей - число
    if (CapacityOfRoom[roomNumberHousing.value].includes(capacityValue)) {
      return;
    } else {
      for (var key in CapacityOfRoom) {
        if (CapacityOfRoom[key].includes(capacityValue)) {
          roomNumberHousing.value = key;
          onRoomNumberChange();
          return;
        }
      }
    }
  };
  // Сохраняем перетаскиваемый файл
  var onAvatarZoneDrop = function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
    var fileName = evt.dataTransfer.files[0];
    evt.dataTransfer.dropEffect = 'copy';
    var imageLoader = new FileReader();
    // Слушаем событие окончания загрузки файла
    imageLoader.addEventListener('load', function () {
      avatarUser.src = imageLoader.result;
    });
    imageLoader.readAsDataURL(fileName);
  };
  var onAvatarZoneDragenter = function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
  };
  var onAvatarZoneDragover = function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
  };
  // Сохраняем фотографии жилища
  var onPhotoZoneDrop = function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
    var fileName = evt.dataTransfer.files[0];
    evt.dataTransfer.dropEffect = 'copy';
    var imageLoader = new FileReader();
    // Слушаем событие окончания загрузки файла
    imageLoader.addEventListener('load', function () {
      var img = document.createElement('IMG');
      img.width = '70';
      img.height = '70';
      uploadPhotos[1].appendChild(img);
      img.src = imageLoader.result;
    });
    imageLoader.readAsDataURL(fileName);
  };
  var onPhotoZoneDragenter = function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
  };
  var onPhotoZoneDragover = function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
  };
  // Отправка формы на сервер
  var onFormSubmit = function (evt) {
    window.backend.save(new FormData(formNotice), resetForm, window.backend.onErrorSave);
    evt.preventDefault();
  };

  // Обработчики событий
  // проверка ввода заголовка
  titleHousing.addEventListener('invalid', onTitleInvalid);
  titleHousing.addEventListener('blur', onTitleBlur);
  titleHousing.addEventListener('focus', onTitleFocus);
  // Событие изменения времени въезда
  timeInHousing.addEventListener('change', onTimeInChange);
  // Событие изменения времени выезда
  timeOutHousing.addEventListener('change', onTimeOutChange);
  // Событие изменения типа жилья
  typeHousing.addEventListener('change', onTypeChange);
  // Проверка ввода суммы стоимости за ночь
  priceHousing.addEventListener('invalid', onPriceInvalid);
  priceHousing.addEventListener('change', onPriceChange);
  // Событие изменения количества комнат
  roomNumberHousing.addEventListener('change', onRoomNumberChange);
  // Событие изменения количества гостей
  capacityHousing.addEventListener('change', onCapacityChange);
  // События сброса файла с аватаркой в drop-зоне
  avatarZone.addEventListener('drop', onAvatarZoneDrop);
  avatarZone.addEventListener('dragenter', onAvatarZoneDragenter);
  avatarZone.addEventListener('dragover', onAvatarZoneDragover);
  // События сброса файлов с фотографиями в drop-зоне
  photoZone.addEventListener('drop', onPhotoZoneDrop);
  photoZone.addEventListener('dragenter', onPhotoZoneDragenter);
  photoZone.addEventListener('dragover', onPhotoZoneDragover);
  // Событие отправки формы на сервер
  formNotice.addEventListener('submit', onFormSubmit);

  return {
    // Устанавливаем значение в поле адреса
    setAddressHousing: function () {
      addressHousing.value = window.pinMain.getCoords();
    },
    activate: function () {
      formNotice.classList.remove('notice__form--disabled');
      [].forEach.call(formFields, function (element) {
        element.removeAttribute('disabled', 'disabled');
      });
      window.form.setAddressHousing();
    },
    init: function () {
      [].forEach.call(formFields, function (element) {
        element.setAttribute('disabled', 'disabled');
      });
      roomNumberHousing.value = '1';
      capacityHousing.value = '1';
    }
  };
})();
