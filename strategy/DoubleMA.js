const { log: logger } = console;

const CtaTemplate = require('./CtaTemplate');

/**
 * 双均线策略
 */
class DoubleMA extends CtaTemplate {
  constructor() {
    super('DoubleMA', 'JustinChow<zhou78620051@126.com>');

    this.short = 0; // 短周期天数
    this.long = 0; // 长周期天数
    this.initDays = 0; // 初始化天数
    this.barCount = 0; // 当前 bar 的数据长度
    this.windows = []; // 视窗

    this.maShort = 0; // 当前短 ma
    this.maLong = 0; // 当前长 ma
    this.lastMaShort = 0; // 上一次短 ma
    this.lastMaLong = 0; // 上一次长 ma
  }

  init(short, long) {
    this.short = short;
    this.long = long;
    this.initDays = this.short + this.long;
    this.windows = Array(this.long).fill(0);
  }

  /**
   * 计算视窗中开始结束为止的均值
   *
   * @param {int} start
   * @param {int} end
   */
  calcMean(start, end) {
    let total = 0;
    let count = 0;
    for (let idx = start; idx < end; idx++) {
      count += 1;
      total += this.windows[idx];
    }
    if (count <= 0) return 0;
    return total / count;
  }

  /**
   * 当有新的 K线数据触发时执行策略
   *
   * @param {Bar} bar K线数据
   */
  onBar(bar) {
    super.onBar(bar);

    // 填充初始数据
    this.windows.shift();
    this.windows.push(bar.close);

    this.barCount += 1;
    if (this.barCount < this.initDays) return;

    // 计算均值 moving average
    this.maShort = this.calcMean(this.long - this.short, this.long);
    this.maLong = this.calcMean(0, this.long);

    // 金叉
    const goldX = this.maShort >= this.maLong && this.lastMaShort < this.lastMaLong;
    // 死叉
    const deadX = this.maShort <= this.maLong && this.lastMaShort > this.lastMaLong;

    if (goldX) {
      // 金叉平空开多
      if (this.position === 0) {
        this.openLong(bar.close, 10);
      } else if (this.position < 0) {
        this.closeShort(bar.close, 10);
        this.openLong(bar.close, 10);
      }
    }

    if (deadX) {
      // 死叉平多开空
      if (this.position === 0) {
        this.openShort(bar.close, 10);
      } else if (this.position > 0) {
        this.closeLong(bar.close, 10);
        this.openShort(bar.close, 10);
      }
    }

    this.lastMaShort = this.maShort;
    this.lastMaLong = this.maLong;
  }

  /**
   * 当回测的时候, 最后模拟平仓用
   */
  close() {
    const price = this.windows[this.windows.length - 1];
    if (this.position > 0) {
      this.closeLong(price, 10);
    }
    if (this.position < 0) {
      this.closeShort(price, 10);
    }
  }
}

module.exports = DoubleMA;
