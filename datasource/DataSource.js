
const { log: logger } = console;

const EventEmitter = require('events').EventEmitter;

class DataSource extends EventEmitter {
  constructor() {
    super();
  }

  /**
   * 主动拉取 ticker 数据
   */
  loadTick() {
    logger('load tick data');
    return null;
  }

  /**
   * 被动触发 ticker 数据
   */
  onTick() {
    logger('on tick data');
    this.emit('tick', null);
  }

  /**
   * 主动拉取 bar K线数据
   */
  loadBar() {
    logger('load bar data');
    return null;
  }

  /**
   * 被动触发 bar K线数据
   */
  onBar() {
    logger('on bar data');
    this.emit('bar', null);
  }
}

module.exports = DataSource;
