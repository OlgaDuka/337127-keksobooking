'use strict';
window.backend = (function () {
  // Константы и переменные
  var TIME_OUT = 10000;
  var CODE_SUCSESS = 200;
  var Messages = {
    errorNet: 'Произошла ошибка соединения',
    errorTime: 'Запрос не успел выполниться за '
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
      onError(Messages.errorNet);
    });
    // Обработка слишком долгого ожидания загрузки
    xhr.addEventListener('timeout', function () {
      onError(Messages.errorTime + xhr.timeout + 'мс');
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
    // Функция создания элемента с сообщением об ошибке
    createMessageError: function () {
      node.style = 'z-index: 100; margin: 5px auto; text-align: center; background-color: magenta; border: 2px solid black';
      node.style.position = 'absolute';
      node.style.left = 0;
      node.style.right = 0;
      node.style.fontSize = '30px';
      node.textContent = '';
      document.body.insertAdjacentElement('afterbegin', node);
      node.classList.add('hidden');
    },
    // Ошибка - выводим сообщение для пользователя
    onError: function (errorMessage) {
      node.textContent = errorMessage;
      node.classList.remove('hidden');
    },
    // Убираем ошибку
    removeError: function () {
      node.textContent = '';
      node.classList.add('hidden');
    }
  };
})();
