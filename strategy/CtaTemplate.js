
const { log: logger } = console;

const Template = require('./Template');

class CtaTemplate extends Template {
  onTick(tick) {
    this.log('on tick %j', tick);
  }

  onBar(bar) {
    this.log('on bar %j', bar);
  }
}

module.exports = CtaTemplate;
