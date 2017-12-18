'use strict';
window.util = (function () {
  return {
    // Синхронизация полей формы
    synchronizeFields: function (elementMain, elementDependent, arrMain, arrDependent, funcSyncValues) {
      var numElement = arrMain.indexOf(elementMain.value);
      var elementDependentValue = arrDependent[numElement];
      funcSyncValues(elementDependent, elementDependentValue);
    },
    // Очистка контейнера
    clearContainer: function (container, numChild) {
      while (container.childElementCount > numChild) {
        container.removeChild(container.lastChild);
      }
    }
  };
})();
