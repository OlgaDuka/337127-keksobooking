'use strict';
window.backend = (function () {
  // Константы
  var TIME_OUT = 10000;
  var CODE_SUCSESS = 200;
  var ERROR_MESSAGE = {
    mes1: 'Произошла ошибка соединения',
    mes2: 'Запрос не успел выполниться за '
  };
  var URL = 'https://1510.dump.academy/keksobooking';

  // Функция создания запроса к серверу
  var createRequest = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    // Событие окончания загрузки
    xhr.addEventListener('load', function () {
      if (xhr.status === CODE_SUCSESS) {
        onSuccess(xhr.response);
      } else {
        onError(xhr.response);
      }
    });
    // Обработка ошибки во время загрузки
    xhr.addEventListener('error', function () {
      onError(ERROR_MESSAGE.mes1);
    });
    // Обработка слишком долгого ожидания загрузки
    xhr.addEventListener('timeout', function () {
      onError(ERROR_MESSAGE.mes2 + xhr.timeout + 'мс');
    });
    xhr.timeout = TIME_OUT;
    return xhr;
  };
  // Функции обмена данными с сервером, экспортируемые из модуля
  return {
    load: function (onSuccess, onError) {
      var xhr = createRequest(onSuccess, onError);
      xhr.open('GET', URL + '/data');
      xhr.send();
    },
    save: function (data, onSuccess, onError) {
      var xhr = createRequest(onSuccess, onError);
      xhr.open('POST', URL);
      xhr.send(data);
    }
  };
})();
