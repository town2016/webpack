const Move = function() {};

const curve = Move.prototype = {
  extend: function(obj) {
    for (const k in obj) {
      if (k in curve) {
        try {
          console.warn(k + '已经被修改!');
        } catch (e) {}
      }
      curve[k] = ((moveType) => {
        return (...arg) => {
          return _doMove.call(this, arg, moveType);
        };
      })(obj[k]);
    }
  }
};

const request = window.requestAnimationFrame;

const stopRequest = window.cancelAnimationFrame;

let _move, _stopMove;

// 初始化运动函数和停止函数
if (request) {
  _move = function(fn, timer) {
    const step = function() {
      if (!fn()) timer.id = request(step);
    };
    step();
  };
} else {
  _move = function(fn, timer) {
    timer.id = setInterval(fn, 16);
  };
}

if (stopRequest) {
  _stopMove = function(timer) {
    stopRequest(timer.id);
  };
} else {
  _stopMove = function(timer) {
    clearInterval(timer.id);
  };
}

// 开始动画函数
function _doMove(arg, moveType) {
  let r, d, fn, fnEnd;

  // 严格限制传入参数, 且传入的参数可以没有顺序
  for (let i = 0; i < 4; i++) {
    if (typeof arg[i] === 'object' && !r) r = arg[i];
    else if (typeof arg[i] === 'number' && !d) d = arg[i];
    else if (typeof arg[i] === 'function' && !fn) fn = arg[i];
    else if (typeof arg[i] === 'function' && !fnEnd) fnEnd = arg[i];
  }
  if (!(r instanceof Array) || !fn) return;
  d = d || 500;

  const from = +new Date();
  // 起始时间
  let x = 0;
  let y;
  const a = r[0];
  const b = r[1];

  const timer = 't' + Math.random();

  const self = this;

  // 用于保存定时器ID的对象, requestAnimation递归调用必须传入对象
  this[timer] = {};

  _move(() => {
    x = (+new Date() - from) / d;
    if (x >= 1) {
      // 动画结束
      fn(b);
      if (fnEnd) fnEnd();
      return true;
    } else {
      y = moveType(x);
      fn(a + (b - a) * y);
    }
  }, self[timer]);

  return () => {
    _stopMove(self[timer]);
    return a + (b - a) * y;
  };
}

const PI = Math.PI;

const sin = Math.sin;

const cos = Math.cos;

const pow = Math.pow;

const abs = Math.abs;

const sqrt = Math.sqrt;

/** ***  动画曲线  ******/

curve.extend({
  // 定义域和值域均为[0, 1], 传入自变量x返回对应值y
  // 先加速后减速
  ease: function(x) {
    // return -0.5*cos(PI * (2 - x)) + 0.5;
    if (x <= 0.5) return 2 * x * x;
    else if (x > 0.5) return -2 * x * x + 4 * x - 1;
  },

  // 初速度为0 ,一直加速
  easeIn: function(x) {
    return x * x;
  },

  // 先慢慢加速1/3, 然后突然大提速, 最后减速
  ease2: function(x) {
    return x < 1 / 3 ? x * x : -2 * x * x + 4 * x - 1;
  },

  // 初速度较大, 一直减速, 缓冲动画
  easeOut: function(x) {
    return pow(x, 0.8);
  },

  // 碰撞动画
  collision: function(x) {
    var a, b; // a, b代表碰撞点的横坐标
    for (var i = 1, m = 20; i < m; i++) {
      a = 1 - (4 / 3) * pow(0.5, i - 1);
      b = 1 - (4 / 3) * pow(0.5, i);
      if (x >= a && x <= b) {
        return pow(3 * (x - (a + b) / 2), 2) + 1 - pow(0.25, i - 1);
      }
    }
  },

  // 弹性动画
  elastic: function(x) {
    return -pow(1 / 12, x) * cos(PI * 2.5 * x * x) + 1;
  },

  // 匀速动画
  linear: function(x) {
    return x;
  },

  // 断断续续加速减速
  wave: function(x) {
    return (1 / 12) * sin(5 * PI * x) + x;
  },

  // 先向反方向移动一小段距离, 然后正方向移动, 并超过终点一小段, 然后回到终点
  opposite: function(x) {
    return (sqrt(2) / 2) * sin((3 * PI / 2) * (x - 0.5)) + 0.5;
  }

});

const moveInstance = new Move();

export default moveInstance;