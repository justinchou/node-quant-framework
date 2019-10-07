
const { log: logger } = console;

const EventEmitter = require('events').EventEmitter;

const {
  parseFloorDecimal,
  parseCeilDecimal,
} = require('../helpers/decimals');

class Template extends EventEmitter {
  constructor(className, author) {
    super();

    this.className = className;
    this.author = author;

    this.slippage = 0; // 滑点
    this.rate = 0; // 手续费
    this.priceDecimal = 0; // 价格精度
    this.capital = 0; // 初始资金

    this.position = 0; // 当前仓位

    this.orders = [];
  }

  /**
   * 设置价格滑点
   *
   * @param {float} slippage 滑点
   */
  setSlippage(slippage) {
    this.slippage = slippage;
  }

  /**
   * 设置手续费率
   *
   * @param {float} rate 手续费率
   */
  setRate(rate) {
    this.rate = rate;
  }

  /**
   * 设置价格精度的小数位数
   *
   * @param {int} priceDecimal 价格精度
   */
  setPriceDecimal(priceDecimal) {
    this.priceDecimal = priceDecimal;
  }

  /**
   * 设置初始资本
   *
   * @param {float} capital 初始资本
   */
  setCapital(capital) {
    this.capital = capital;
  }

  /**
   * 设置当前头寸
   *
   * @param {float} position 当前头寸
   */
  setPosition(position) {
    this.position = position;
  }

  /**
   * 开多
   * @param {float} price 价格
   * @param {float} amount 数量
   */
  openLong(price, amount) {
    if (this.capital / price < amount) {
      logger('invalid open position %s, max %s', amount, this.capital / price);
      return false;
    }

    const openPrice = parseCeilDecimal(price * (1 + this.slippage), this.priceDecimal);
    this.emit('openLong', openPrice, amount);
  }

  onOpenLong(price, amount) {
    this.capital -= price * amount;
    this.position += amount;
  }

  /**
   * 开空
   * @param {float} price 价格
   * @param {float} amount 数量
   */
  openShort(price, amount) {
    if (this.capital / price < amount) {
      logger('invalid open position %s, max %s', amount, this.capital / price);
      return false;
    }

    const openPrice = parseFloorDecimal(price * (1 - this.slippage), this.priceDecimal);
    this.emit('openShort', openPrice, amount);
  }

  onOpenShort(price, amount) {
    this.capital -= price * amount;
    this.position -= amount;
  }

  /**
   * 平多
   * @param {float} price 价格
   * @param {float} amount 数量
   */
  closeLong(price, amount) {
    if (Math.abs(this.position) < amount) {
      logger('invalid close position %s, only %s', amount, this.position);
      return false;
    }

    const closePrice = parseFloorDecimal(price * (1 - this.slippage), this.priceDecimal);
    this.emit('closeLong', closePrice, amount);
  }

  onCloseLong(price, amount) {
    this.capital += price * amount;
    this.position -= amount;
  }

  /**
   * 平空
   * @param {float} price 价格
   * @param {float} amount 数量
   */
  closeShort(price, amount) {
    if (Math.abs(this.position) < amount) {
      logger('invalid close position %s, only %s', amount, this.position);
      return false;
    }

    const closePrice = parseCeilDecimal(price * (1 + this.slippage), this.priceDecimal);
    this.emit('closeShort', closePrice, amount);
  }

  onCloseShort(price, amount) {
    this.capital += price * amount;
    this.position += amount;
  }

  onInit() {
    this.log('engine init');
  }

  onStart() {
    this.log('engin start');
  }

  onStop() {
    this.log('engine stop');
  }

  onOrder(order) {
    this.log('place order %j', order);
  }

  onTrade(trade) {
    this.log('order done %j', trade);
    this.orders.push(trade);
  }

  onCancel(order) {
    this.log('order canceled %j', order);
  }

  log(...str) {
    logger(...str);
  }
}

module.exports = Template;
