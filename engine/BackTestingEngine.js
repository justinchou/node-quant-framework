
const { log: logger } = console;

const Engine = require('./Engine');

/**
 * 引擎模式
 */
const EngineMode = {
  BAR_MODE: 1, // 基于 K线的策略
  TICK_MODE: 2, // 基于 Tick 成交单的策略
}

class BackTestingEngine extends Engine {
  constructor() {
    super();

    this.mode = null; // 模式
    this.dataSource = null; // 数据源
  }

  /**
   * 设置策略模式
   *
   * @param {EngineMode} mode 策略模式
   */
  setMode(mode) {
    this.mode = mode;
  }

  /**
   * 设置数据源
   *
   * @param {DataSource} dataSource 数据源
   */
  setDateSource(dataSource) {
    this.dataSource = dataSource;
  }

  /**
   * 设置策略
   *
   * @param {Template} strategy 策略
   */
  setStrategy(strategy) {
    super.setStrategy(strategy);

    // 指定策略为回测模式
    this.setBackTesting(true);
  }

  openLong(price, amount) {
    super.openLong(price, amount);

    this.strategy.onOrder({ price, amount, type: 'buy' });
    this.strategy.onTrade({ price, amount, type: 'buy' });
    this.strategy.onOpenLong(price, amount);
  }

  openShort(price, amount) {
    super.openShort(price, amount);

    this.strategy.onOrder({ price, amount, type: 'sell' });
    this.strategy.onTrade({ price, amount, type: 'sell' });
    this.strategy.onOpenShort(price, amount);
  }

  closeLong(price, amount) {
    super.closeLong(price, amount);

    this.strategy.onOrder({ price, amount, type: 'sell' });
    this.strategy.onTrade({ price, amount, type: 'sell' });
    this.strategy.onCloseLong(price, amount);
  }

  closeShort(price, amount) {
    super.closeShort(price, amount);

    this.strategy.onOrder({ price, amount, type: 'buy' });
    this.strategy.onTrade({ price, amount, type: 'buy' });
    this.strategy.onCloseShort(price, amount);
  }

  /**
   * 执行策略
   */
  run() {
    super.run();

    let data = null;

    // 判断策略模式
    switch (this.mode) {
      case EngineMode.BAR_MODE:
        // 从数据源抓取 K线数据
        data = this.dataSource.loadBar();
        while (data) {
          // 触发策略
          this.strategy.onBar(data);
          data = this.dataSource.loadBar();
        }
        break;
      case EngineMode.TICK_MODE:
        // 从数据源抓取 Ticker 成交单数据
        data = this.dataSource.loadTick();
        while (data) {
          // 触发策略
          this.strategy.onTick(data);
          data = this.dataSource.loadTick();
        }
        break;
      default:
        break;
    }
  }
}

Object.keys(EngineMode)
  .forEach(mode => BackTestingEngine[mode] = EngineMode[mode]);

module.exports = BackTestingEngine;

// const engine = new BackTestingEngine();
// engine.setMode(BackTestingEngine.BAR_MODE);
// logger(engine);
