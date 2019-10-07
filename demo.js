const Exchange = require('./exchange/FakeExchange');
const DataSource = require('./datasource/FakeDataSource');

const Strategy = require('./strategy/DoubleMA');
const Engine = require('./engine/BackTestingEngine');

// 交易所
const exchange = new Exchange();

// 数据源
const datasource = new DataSource();

// 策略
const strategy = new Strategy();

// 不同策略独立的配置
strategy.init(5, 20);

// 所有策略公有配置
strategy.setSlippage(0.002); // 设置滑点
strategy.setRate(0.0016); // 设置手续费率
strategy.setPriceDecimal(2); // 设置价格精度
strategy.setCapital(10000); // 设置初始资产

// 引擎
const engine = new Engine();
engine.setMode(Engine.BAR_MODE); // 设置回测模式为基于 K线
engine.setDateSource(datasource); // 设置数据源
engine.setExchange(exchange); // 设置交易所
engine.setStrategy(strategy); // 设置策略

// 启动回测引擎
engine.run();

// 回测情况下, 结束后清空头寸
strategy.close();

console.log(strategy);
