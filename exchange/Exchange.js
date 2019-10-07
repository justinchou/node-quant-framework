const { log: logger } = console;

class Exchange {
  constructor() { }

  /**
   * 开多
   * @param {float} price 价格
   * @param {float} amount 数量
   */
  openLong(price, amount) {
    logger('open long', price, amount);
  }

  /**
   * 开空
   * @param {float} price 价格
   * @param {float} amount 数量
   */
  openShort(price, amount) {
    logger('open short', price, amount);
  }

  /**
   * 平多
   * @param {float} price 价格
   * @param {float} amount 数量
   */
  closeLong(price, amount) {
    logger('close long', price, amount);
  }

  /**
   * 平空
   * @param {float} price 价格
   * @param {float} amount 数量
   */
  closeShort(price, amount) {
    logger('close short', price, amount);
  }
}

module.exports = Exchange;
