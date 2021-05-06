function animate({duration, timing, draw}) {
  
  // время запуска анимации
  let start = performance.now();
  
  
  requestAnimationFrame( function animate(time) {
    
    // создаст коэффициент: (<настоящее время> - <время запуска>) / <длительность анимации>
    let k = (time - start) / duration;
    
    // уберет остаток после запятой
    if (k > 1) k = 1;
    
    // преобразует коэффициент через функцию
    let progress = timing(k);
    
    // отрисует анимацию
    draw(progress);
    
    // продолжит рекурсию, если коэффициент < 1
    if (k < 1) requestAnimationFrame(animate);
    
    
  } );
  
}


// функции анимации
function linear(progress) {
  return progress;
}

function quad(timeFraction) {
  return Math.pow(timeFraction, 3)
}

function circ(timeFraction) {
  return 1 - Math.sin(Math.acos(timeFraction));
}

function back(timeFraction) {
  return Math.pow(timeFraction, 2) * ((1.5 + 1) * timeFraction - 1.5)
}

function bounce(timeFraction) {
  for (let a = 0, b = 1, result; 1; a += b, b /= 2) {
    if (timeFraction >= (7 - 4 * a) / 11) {
      return -Math.pow((11 - 6 * a - 11 * timeFraction) / 4, 2) + Math.pow(b, 2)
    }
  }
}

function easeInQuad(timeFraction) {
    return Math.pow(timeFraction, 2);
}
function easeInCirc(timeFraction) {
    return 1 - Math.sin(Math.acos(timeFraction));
}
function easeInBack(timeFraction) {
    return Math.pow(timeFraction, 2) * ((3 + 1) * timeFraction - 3);
}
function easeInBounce(timeFraction) {
    for (var a = 0, b = 1, result; 1; a += b, b /= 2) {
        if (timeFraction >= (7 - 4 * a) / 11) {
            return -Math.pow((11 - 6 * a - 11 * timeFraction) / 4, 2) + Math.pow(b, 2)
        }
    }
}
function easeInElastic(timeFraction) {
    return Math.pow(2, 10 * (timeFraction - 1)) * Math.cos(20 * Math.PI * 1.5 / 3 * timeFraction);
}

function makeEaseOut(timing) {
    return function (timeFraction) {
        return 1 - timing(1 - timeFraction);
    }
}
easeOutQuad = makeEaseOut(easeInQuad);
easeOutCirc = makeEaseOut(easeInCirc);
easeOutBack = makeEaseOut(easeInBack);
easeOutBounce = makeEaseOut(easeInBounce);
easeOutElastic = makeEaseOut(easeInElastic);

function makeEaseInOut(timing) {
    return function (timeFraction) {
        if (timeFraction < .5)
            return timing(2 * timeFraction) / 2;
        else
            return (2 - timing(2 * (1 - timeFraction))) / 2;
    }
}
easeInOutQuad = makeEaseInOut(easeInQuad);
easeInOutCirc = makeEaseInOut(easeInCirc);
easeInOutBack = makeEaseInOut(easeInBack);
easeInOutBounce = makeEaseInOut(easeInBounce);
easeInOutElastic = makeEaseInOut(easeInElastic);