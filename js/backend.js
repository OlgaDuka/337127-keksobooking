'use strict';
(function () {
  // Константы и переменные
  var TIME_OUT = 10000;
  var CODE_SUCSESS = 200;
  var Messages = {
    ERROR_NET: 'Произошла ошибка соединения',
    ERROR_TIME: 'Запрос не успел выполниться за '
  };
  // Путь на сервер
  var URL = 'https://1510.dump.academy/keksobooking';
  // Элемент DOM-дерева для вывода сообщений об ошибках
  var node = document.createElement('div');

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
      onError(Messages.ERROR_NET);
    });
    // Обработка слишком долгого ожидания загрузки
    xhr.addEventListener('timeout', function () {
      onError(Messages.ERROR_TIME + xhr.timeout + 'мс');
    });
    xhr.timeout = TIME_OUT;
    return xhr;
  };
  // Функции обмена данными с сервером, экспортируемые из модуля
  window.backend = {
    load: function (onSuccess, onErrorLoad) {
      var xhr = createRequest(onSuccess, onErrorLoad);
      xhr.open('GET', URL + '/data');
      xhr.send();
    },
    save: function (data, onSuccess, onErrorSave) {
      var xhr = createRequest(onSuccess, onErrorSave);
      xhr.open('POST', URL);
      xhr.send(data);
    },
    // Функция создания элемента с сообщением об ошибке
    createMessageError: function () {
      node.style.zIndex = '100';
      node.style.margin = '10px auto';
      node.style.textAlign = 'center';
      node.style.backgroundColor = 'magenta';
      node.style.border = '2px solid black';
      node.style.position = 'absolute';
      node.style.left = 0;
      node.style.right = 0;
      node.style.fontSize = '30px';
      node.textContent = '';
      document.body.insertAdjacentElement('afterbegin', node);
      node.classList.add('hidden');
    },
    // Ошибка загрузки данных - выводим сообщение для пользователя
    onErrorLoad: function (errorMessage) {
      node.textContent = errorMessage;
      node.classList.remove('hidden');
      node.style.top = '0px';
    },
    // Ошибка отправки данных - выводим сообщение для пользователя
    onErrorSave: function (errorMessage) {
      node.textContent = errorMessage;
      node.classList.remove('hidden');
      node.style.top = '1450px';
    },
    // Убираем ошибку
    removeError: function () {
      node.textContent = '';
      node.classList.add('hidden');
    }
  };
})();
