'use strict';
window.backend = (function () {
  // Константы
  var TIME_OUT = 10000;
  var CODE_SUCSESS = 200;
  var MESSAGES = {
    errorNet: 'Произошла ошибка соединения',
    errorTime: 'Запрос не успел выполниться за '
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
      onError(MESSAGES.errorNet);
    });
    // Обработка слишком долгого ожидания загрузки
    xhr.addEventListener('timeout', function () {
      onError(MESSAGES.errorTime + xhr.timeout + 'мс');
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
    },
    // Ошибка - выводим сообщение для пользователя
    errorHandler: function (errorMessage) {
      var node = document.createElement('div');
      node.style = 'z-index: 100; margin: 5px auto; text-align: center; background-color: magenta; border: 2px solid black';
      node.style.position = 'absolute';
      node.style.left = 0;
      node.style.right = 0;
      node.style.fontSize = '30px';
      node.textContent = errorMessage;
      document.body.insertAdjacentElement('afterbegin', node);
    }
  };
})();
