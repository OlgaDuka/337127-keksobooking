'use strict';
window.card = (function () {
  // Переменные
  var offerType = {
    flat: 'Квартира',
    bungalo: 'Лачуга',
    house: 'Дом',
    palace: 'Дворец'
  };
  // Функции
  // Подготовка строки для вставки списка удобств
  var getStringFeatures = function (elem) {
    return '<li class="feature feature--' + elem + '"></li>';
  };
  // Подготовка строки для вставки фотографий
  var getStringPictures = function (elem) {
    return '<li><img src="' + elem + '" width="70"></li>';
  };

  // Экспортируем функцию формирования карточки объекта недвижимости
  return {
    render: function (linkCard, objAd) {
      var linkCardP = linkCard.querySelectorAll('p');
      var linkCardUl = linkCard.querySelector('.popup__features');
      var linkCardUlGallery = linkCard.querySelector('.popup__pictures');
      linkCard.querySelector('img').src = objAd.author.avatar;
      linkCard.querySelector('h3').textContent = objAd.offer.title;
      linkCard.querySelector('.popup__price').innerHTML = objAd.offer.price + '&#x20bd;/ночь';
      linkCard.querySelector('small').textContent = objAd.offer.address;
      linkCard.querySelector('h4').textContent = offerType[objAd.offer.type];
      linkCardP[2].textContent = objAd.offer.rooms + ' комнаты для ' + objAd.offer.guests + ' гостей';
      linkCardP[3].textContent = 'Заезд после ' + objAd.offer.checkin + ', выезд до ' + objAd.offer.checkout;
      linkCardP[4].textContent = objAd.offer.description;
      linkCardUl.innerHTML = '';
      linkCardUl.insertAdjacentHTML('afterBegin', objAd.offer.features.map(getStringFeatures).join(' '));
      linkCard.appendChild(linkCardUl);
      linkCardUlGallery.innerHTML = '';
      linkCardUlGallery.insertAdjacentHTML('afterBegin', objAd.offer.photos.map(getStringPictures).join(' '));
      linkCard.appendChild(linkCardUlGallery);
      return linkCard;
    }
  };
})();
