'use strict';
window.card = (function () {
  // Подготовка строки для вставки списка удобств
  var getStringFeatures = function (elem) {
    return '<li class="feature feature--' + elem + '"></li>';
  };

  // Экспортируем функцию формирования карточки объекта недвижимости
  return {
    render: function (linkCard, objAd) {
      var linkCardP = linkCard.querySelectorAll('p');
      var linkCardUl = linkCard.querySelector('.popup__features');
      linkCard.querySelector('img').src = objAd.author.avatar;
      linkCard.querySelector('h3').textContent = objAd.offer.title;
      linkCard.querySelector('.popup__price').innerHTML = objAd.offer.price + '&#x20bd;/ночь';
      linkCard.querySelector('small').textContent = objAd.offer.address;
      linkCard.querySelector('h4').textContent = window.data.arrTypes[objAd.offer.type];
      linkCardP[2].textContent = objAd.offer.rooms + ' комнаты для ' + objAd.offer.guests + ' гостей';
      linkCardP[3].textContent = 'Заезд после ' + objAd.offer.checkin + ', выезд до ' + objAd.offer.checkout;
      linkCardP[4].textContent = objAd.offer.description;
      linkCardUl.innerHTML = '';
      linkCardUl.insertAdjacentHTML('afterBegin', objAd.offer.features.map(getStringFeatures).join(' '));
      linkCard.appendChild(linkCardUl);
      return linkCard;
    }
  };
})();
