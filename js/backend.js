'use strict';
window.backend = (function () {
  var URL = 'https://1510.dump.academy/keksobooking';
  var createRequest = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    // Событие окончания загрузки
    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onSuccess(xhr.response);
      } else {
        onError(xhr.response);
      }
    });
    // Обработка ошибки во время загрузки
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    // Обработка слишком долгого ожидания загрузки
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
    xhr.timeout = 10000;
    return xhr;
  };

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
