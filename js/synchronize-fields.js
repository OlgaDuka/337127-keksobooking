'use strict';
window.synchronizeFields = function (elemMain, elemDependent, arrMain, arrDependent, funcSyncValues) {
  var numElem = arrMain.indexOf(elemMain.value);
  var elemDependentValue = arrDependent[numElem];
  funcSyncValues(elemDependent, elemDependentValue);
};
