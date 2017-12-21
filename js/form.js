'use strict';
(function () {
  // =========================================================================
  // Константы и переменные
  // =========================================================================
  var OFFER_TYPES = ['flat', 'bungalo', 'house', 'palace'];
  var OFFER_CHECKS = ['12:00', '13:00', '14:00'];
  var MIN_PRICES = [1000, 0, 5000, 10000];
  var BORDER_COLOR_DEFAULT = '#d9d9d3';
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
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
  var fileChoosers = document.querySelectorAll('.upload input[type=file]');
  var dropZoneImages = formNotice.querySelectorAll('.drop-zone');
  var avatarZone = dropZoneImages[0];
  var avatarUser = formNotice.querySelector('.notice__preview img');
  var photoZone = dropZoneImages[1];
  var uploadPhoto = formNotice.querySelector('.form__photo-container');

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
    var childs = uploadPhoto.querySelectorAll('img');
    [].forEach.call(childs, function (element) {
      uploadPhoto.removeChild(element);
    });
    avatarUser.src = 'img/muffin.png';
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
    element.style.borderColor = BORDER_COLOR_DEFAULT;
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
    var guests = CapacityOfRoom[roomNumberHousing.value];
    [].forEach.call(capacityHousing.options, function (element) {
      if (guests.includes(element.value)) {
        activateCapacityOption(element);
      } else {
        deactivateCapacityOption(element);
      }
    });
    capacityHousing.value = guests[0];
  };
  // Изменение количества комнат, если первоначально изменение было в количестве гостей
  var onCapacityChange = function () {
    var capacityValue = capacityHousing.value;
    if (!CapacityOfRoom[roomNumberHousing.value].includes(capacityValue)) {
      for (var key in CapacityOfRoom) {
        if (CapacityOfRoom[key].includes(capacityValue)) {
          roomNumberHousing.value = key;
          onRoomNumberChange();
          return;
        }
      }
    }
  };
  // Добавление фотографий на форму
  var upLoadImage = function (evt, getFile, showMiniFile) {
    var files = getFile(evt);
    [].forEach.call(files, function (file) {
      var fileName = file.name.toLowerCase();
      var matches = FILE_TYPES.some(function (element) {
        return fileName.endsWith(element);
      });
      if (matches) {
        var imageLoader = new FileReader();
        imageLoader.addEventListener('load', function (e) {
          showMiniFile(e.target.result);
        });
        imageLoader.readAsDataURL(file);
      }
    });
  };
  // Получаем файл фото при перетаскивании
  var getDraggedFile = function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
    var files = evt.dataTransfer.files;
    evt.dataTransfer.dropEffect = 'copy';
    return files;
  };
  // Получаем файл фото через диалог
  var getDialogFile = function (evt) {
    return evt.target.files;
  };
  // Показываем миниатюры на форме
  var showMiniAvatar = function (content) {
    avatarUser.src = content;
  };
  var showMiniPhoto = function (content) {
    var img = document.createElement('IMG');
    img.width = '50';
    img.height = '50';
    uploadPhoto.appendChild(img);
    img.src = content;
  };
  // Добавляем файлы через окно выбора файлов
  var onChooserAvatarChange = function (evt) {
    upLoadImage(evt, getDialogFile, showMiniAvatar);
  };
  var onChooserPhotoChange = function (evt) {
    upLoadImage(evt, getDialogFile, showMiniPhoto);
  };
  // Добавляем перетаскиваемые файлы
  var onAvatarZoneDrop = function (evt) {
    upLoadImage(evt, getDraggedFile, showMiniAvatar);
  };
  var onPhotoZoneDrop = function (evt) {
    upLoadImage(evt, getDraggedFile, showMiniPhoto);
  };
  // Разрешаем процесс перетаскивания фотографий в дроп-зону
  var onDropZoneDragenter = function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
  };
  var onDropZoneDragover = function (evt) {
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
  // События сброса фото-файлов в drop-зоне
  avatarZone.addEventListener('drop', onAvatarZoneDrop);
  photoZone.addEventListener('drop', onPhotoZoneDrop);
  [].forEach.call(dropZoneImages, function (element) {
    element.addEventListener('dragenter', onDropZoneDragenter);
  });
  [].forEach.call(dropZoneImages, function (element) {
    element.addEventListener('dragover', onDropZoneDragover);
  });
  // Событие изменения выборщиков файлов для загрузки
  fileChoosers[0].addEventListener('change', onChooserAvatarChange);
  fileChoosers[1].addEventListener('change', onChooserPhotoChange);
  // Событие отправки формы на сервер
  formNotice.addEventListener('submit', onFormSubmit);

  window.form = {
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
      fileChoosers[1].setAttribute('multiple', true);
    }
  };
})();
