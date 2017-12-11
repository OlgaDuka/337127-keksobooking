'use strict';
window.data = (function () {
  // Константы
  var OFFER_TYPES = ['flat', 'house', 'bungalo', 'palace'];
  var OFFER_CHECKS = ['12:00', '13:00', '14:00'];
  // Переменные:
  // Объект соответствия типов недвижимости
  var offerType = {
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало',
    palace: 'Дворец'
  };
  // Объект соответствия типов недвижимости и минимальной цены
  var offerTypePrice = {
    flat: 1000,
    bungalo: 0,
    house: 5000,
    palace: 10000
  };
  // Экспортируем массивы для синхронизации вводимых в форму данных
  return {
    arrOfferTypes: OFFER_TYPES.slice(),
    arrTypes: OFFER_TYPES.map(function (elem) {
      return offerType[elem];
    }),
    arrPrices: OFFER_TYPES.map(function (elem) {
      return offerTypePrice[elem];
    }),
    arrOfferChecks: OFFER_CHECKS.slice(),
  };
})();
