
const DataSource = require('./DataSource');

class FakeDataSource extends DataSource {
  constructor() {
    super();

    this.index = -1;

    this.ticks = [
      // price, amount, buy 1 / sell -1
      [11.2, 32, -1],
      [10.9, 19, 1],
      [11.2, 85, -1],
      [10.8, 1, -1],
      [11.3, 83, 1],
    ];
    this.bars = [
      // open, high, low, close, volume, timestamp
      [12.6, 15.121, 10.95, 13.2, 10238.13, 1],
      [13.2, 15.9, 9.98, 11.2, 9738.64, 2],
      [11.2, 14.98, 11.15, 12.8, 11238.59, 3],
      [12.2, 14.05, 12.0, 13.9, 18238.49, 4],
      [12.87, 16.0, 10.95, 14.2, 11238.19, 5],
    ];
  }

  // loadTick() {
  //   if (this.ticks.length <= this.index) return null;
  //   this.index += 1;
  //   return this.ticks[this.index];
  // }

  // loadBar() {
  //   if (this.bars.length <= this.index) return null;
  //   this.index += 1;
  //   return this.bars[this.index];
  // }

  loadTick() {
    // TODO 回测数据从数据库中取
    if (this.index < 150) {
      this.index += 1;
      return {
        price: parseInt(Math.random(0, 1) * 100 * 1e3, 10) / 1e3,
        amount: parseInt(Math.random(0, 1) * 1000 * 1e3, 10) / 1e3,
        type: Math.random(0, 1) > 0.5 ? 'buy' : 'sell',
      };

      return null;
    }
  }

  loadBar() {
    // TODO 回测数据从数据库中取
    if (this.index < 150) {
      this.index += 1;
      return {
        close: parseInt(Math.random(0, 1) * 100 * 1e3, 10) / 1e3,
      };
    }

    return null;
  }
}

module.exports = FakeDataSource;
