'use strict';
(function () {
  window.util = {
    // Синхронизация полей формы
    synchronizeFields: function (elementMain, elementDependent, arrMain, arrDependent, funcSyncValues) {
      var numElement = arrMain.indexOf(elementMain.value);
      var elementDependentValue = arrDependent[numElement];
      funcSyncValues(elementDependent, elementDependentValue);
    }
  };
})();
