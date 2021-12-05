window.onload = function(){
    document.addEventListener('click', documentActions);

    // Actions (делегирование события click)
    function documentActions(e){
        const targetElement = e.target;
        if(window.innerWidth > 768 && isMobile.any()){
            if(targetElement.classList.contains('menu__arrow')){
                targetElement.closest('.menu__item').classList.toggle('_hover');
            }
            /*if(!targetElement.closest('.menu__item') && document.querySelectorAll('.menu__item._hover').length > 0){
                remuveClasses(document.querySelectorAll('.menu__item._hover'), "_hover");
            }*/
            else if(!targetElement.closest('.menu__item') && document.querySelector('.menu__item._hover')){
                document.querySelector(".menu__item._hover").classList.remove('_hover');
            }
        }
        if(targetElement.classList.contains('search-form__icon')){
            document.querySelector('.search-form').classList.toggle('_active');
        }
        else if(!targetElement.closest('.search-form') && document.querySelector('.search-form._active')){
            document.querySelector('.search-form').classList.remove('_active');
        }
    }
}

function remuveClasses(el, className){
    for(var i = 0; i < el.lenght; i++){
        el[i].classList.remove(className);
    }
}

// ============================ SPOLLERS ================ //

const spollersArray = document.querySelectorAll('[data-spollers]');
if(spollersArray.length > 0){
    // обычные спойлеры
    const spollersRegular = Array.from(spollersArray).filter(function(item, index, self){
        return !item.dataset.spollers.split(",")[0]; // условие на отсутствие параметра
    });
    // обычные спойлеры
    if(spollersRegular.length > 0){
        initSpollers(spollersRegular);
    }

    // спойлеры с медиа запросами
    const spollersMedia = Array.from(spollersArray).filter(function(item, index, self){
        return item.dataset.spollers.split(",")[0];
    });

    // Инициализация спойлеров с медиа запросами
    if(spollersMedia.length > 0){
        const breakpointsArray = [];
        spollersMedia.forEach(item => {
            const params = item.dataset.spollers;
            const breakpoint = {};
            const paramsArray = params.split(",");
            breakpoint.value = paramsArray[0];
            breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
            breakpoint.item = item;
            breakpointsArray.push(breakpoint);
        });

        // получаем уникальные брейкпоинты
        let mediaQueries = breakpointsArray.map(function(item){
            return '(' + item.type + "-width:" + item.value + "px)," + item.value + ',' + item.type;
        });
        mediaQueries = mediaQueries.filter(function(item, index, self){
            return self.indexOf(item) === index;
        });

        //работаем с каждым брейкпоинтом
        mediaQueries.forEach(breakpoint => {
            const paramsArray = breakpoint.split(",");
            const mediaBreakpoint = paramsArray[1];
            const mediaType = paramsArray[2];
            const matchMedia = window.matchMedia(paramsArray[0]);

            //обьекты с нужными условиями
            const spollersArray = breakpointsArray.filter(function(item){
                if(item.value === mediaBreakpoint && item.type === mediaType){
                    return true;
                }
            });
            //событие
            matchMedia.addListener(function(){
                initSpollers(spollersArray, matchMedia);
            });
            initSpollers(spollersArray, matchMedia);
        });
    }
    // инициализация
    function initSpollers(spollersArray, matchMedia = false){
        spollersArray.forEach(spollersBlock => {
            spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
            if(matchMedia.matches || !matchMedia){
                spollersBlock.classList.add('_init');
                initSpollerBody(spollersBlock);
                spollersBlock.addEventListener("click", setSpollerAction);
            } else {
                spollersBlock.classList.remove('_init');
                initSpollerBody(spollersBlock, false);
                spollersBlock.removeEventListener("click", setSpollerAction);
            }
        });
    }

    //работа с контентом
    function initSpollerBody(spollersBlock, hideSpollerBody = true){
        const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
        if(spollerTitles.lenght > 0){
            spollerTitles.forEach(spollerTitle => {
                if (hideSpollerBody){
                    spollerTitle.removeAttribute('tabindex');
                    if(!spollerTitle.classList.contains('_active')){
                        spollerTitle.nextElementSibling.hidden = true;
                    }
                } else{
                    spollerTitle.setAttribute('tabindex', '-1');
                    spollerTitle.nextElementSibling.hidden = false;
                }
            });
        }
    }
    function setSpollerAction(e){
        const el = e.target;
        if(el.hasAttribute('data-spoller') || el.closest('[data-spoller]')){
            const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');
            const spollersBlock = spollerTitle.closest('[data-spollers]');
            const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false;
            if(!spollersBlock.querySelectorAll('._slide').lenght){
                if(oneSpoller && !spollerTitle.classList.contains('_active')){
                    hideSpollersBody(spollersBlock);
                }
                spollerTitle.classList.toggle('_active');
                _slideToggle(spollerTitle.nextElementSibling, 500);
            }
            e.preventDefault();
        }
    }
    function hideSpollersBody(spollersBlock){
        const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._active');
        if (spollerActiveTitle){
            spollerActiveTitle.classList.remove('_active');
            _slideUp(spollerActiveTitle.nextElementSibling, 500);
        }
    }
}
let _slideUp = (target, duration = 500) =>{
    if(!target.classList.contains('_slide')){
        target.classList.add('_slide');
        target.style.transitionProperty = 'height, margin, padding';
        target.style.transitionDuration = duration + 'ms';
        target.style.height = target.offsetHeight + 'px';
        target.offsetHeight;
        target.style.overflow = 'hidden';
        target.style.height = 0;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        window.setTimeout(() => {
            target.hidden = true;
            target.style.removeProperty('height');
            target.style.removeProperty('padding-top');
            target.style.removeProperty('padding-bottom');
            target.style.removeProperty('margin-top');
            target.style.removeProperty('margin-bottom');
            target.style.removeProperty('overflow');
            target.style.removeProperty('transition-duration');
            target.style.removeProperty('transition-property');
            target.classList.remove('_slide');
        }, duration);
    }
}
let _slideDown = (target, duration = 500) => {
    if(!target.classList.contains('_slide')){
        target.classList.add('_slide');
        if(target.hidden){
            target.hidden = false;
        }
        let height = target.offsetHeight;
        target.style.overflow = 'hidden';
        target.style.height = 0;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        target.offsetHeight;
        target.style.transitionProperty = 'height, margin, padding';
        target.style.transitionDuration = duration + 'ms';
        target.style.height = height + 'px';
        target.style.removeProperty('padding-top');
        target.style.removeProperty('padding-bottom');
        target.style.removeProperty('margin-top');
        target.style.removeProperty('margin-bottom');
        window.setTimeout(()=>{
            target.style.removeProperty('height');
            target.style.removeProperty('overflow');
            target.style.removeProperty('transition-duration');
            target.style.removeProperty('transition-property');
            target.classList.remove('_slide');
        }, duration);

    }
}
let _slideToggle = (target, duration = 500) => {
    if(target.hidden){
        return _slideDown(target, duration);
    } else{
        return _slideUp(target, duration);
    }
}


/* 
  Для родителя спойлеров пишем атрибут data-spollers
  Для заголовков спойлеров пишем атрибут data-spoller
  Если нужновключать/выключать работу спойлеров на разных размерах экранов 
  пишем параметры ширины и типа брейкпоинта
  Например: 
  data-spollers="992,max" - только на экранах меньше либо равно 992px
  data-spollers="768,min" - только на экранах больше либо равно 768px

  Если нужно что бы в блоке открывался только один спойлер добавляем атрибут data-one-spoller
  */

   /*----------BURGER----------*/
    let iconMenu = document.querySelector('.icon__menu');
    let menuBody = document.querySelector('.menu__body');
      
    /*const setListener = (element, type, handler) => {
        if(!element){
            console.log('Cannot read property');
        }
        element.addEventListener(type, handler);
        return () => {
            element.removeEventListener(type, handler);
        };
    }
    setListener(iconMenu, 'click', () => {
        menuBody.classList.toggle('_active');
    });*/

    iconMenu.addEventListener("click", AddClass);
    function AddClass(){
        iconMenu.classList.toggle('_active');
        menuBody.classList.toggle('_active');
    }


//========================isMobile===================//

const isMobile = {      //  -- скрипт помогающий определить на каком устройстве открыта страница
    Android: function (){
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function(){
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function(){
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function(){
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function(){
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function(){
        return (
            isMobile.Android() ||
            isMobile.BlackBerry() ||
            isMobile.iOS() ||
            isMobile.Opera() ||
            isMobile.Windows());
    }
};