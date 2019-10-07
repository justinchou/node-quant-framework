
const { log: logger } = console;

class Engine {
  constructor() {
    this.strategy = null; // 策略
    this.exchange = null; // 交易所
  }

  /**
   * 设置策略
   *
   * @param {Template} strategy 策略
   */
  setStrategy(strategy) {
    this.strategy = strategy;
    this.strategy.on('openLong', this.openLong.bind(this));
    this.strategy.on('openShort', this.openShort.bind(this));
    this.strategy.on('closeLong', this.closeLong.bind(this));
    this.strategy.on('closeShort', this.closeShort.bind(this));
  }

  /**
   * 设置交易所
   *
   * @param {Exchange} exchange 交易所
   */
  setExchange(exchange) {
    this.exchange = exchange;
  }

  openLong(price, amount) {
    if (!this.exchange) return false;
    this.exchange.openLong(price, amount);
  }

  openShort(price, amount) {
    if (!this.exchange) return false;
    this.exchange.openShort(price, amount);
  }

  closeLong(price, amount) {
    if (!this.exchange) return false;
    this.exchange.closeLong(price, amount);
  }

  closeShort(price, amount) {
    if (!this.exchange) return false;
    this.exchange.closeShort(price, amount);
  }

  /**
   * 启动引擎
   */
  run() { }
}

module.exports = Engine;
