# node-quant-framework

## 准备工作

准备了一些初步思路, 大致分为 `Engine 引擎`, `Strategy 策略`, `Exchange 交易所`, `DataSource 数据源` 4 大部分.

1. `DataSource 数据源` 用于提供数据, 数据应该是另一个服务抓取到数据库, 或者是通过 websocket 推送的.
2. `Exchange 交易所` 打通不同交易所 API, 并且提供相同数据接口和数据返回结构.
3. `Strategy 策略` 根据不同的思路, 可以实现一定的程序化交易流程, 把流程整理成可持续的代码.
3. `Engine 引擎` 用于从 `数据源` 抓取数据, 调用 `策略` 给出买卖指令, 发送到 `交易所` 执行买卖指令.

## 回测数据流

### 设置参数

```js
const Exchange = require('./exchange/FakeExchange'); // 模拟交易所
const DataSource = require('./datasource/FakeDataSource'); // 模拟数据源

const Strategy = require('./strategy/DoubleMA'); // 双均线策略
const Engine = require('./engine/BackTestingEngine'); // 回测引擎

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
engine.setMode(Engine.BAR_MODE);
engine.setDateSource(datasource);
engine.setExchange(exchange);
engine.setStrategy(strategy);

// 启动回测引擎
engine.run();

// 回测情况下, 结束后清空头寸
strategy.close();

console.log(strategy);
```

### 数据流

引擎根据设置的 bar mode 选择拉取的数据, 并且以事件的形式发送到 Strategy 的 onTick 或者 onBar 方法.

在 Strategy 中, 经过计算, 得出是五种操作 pass, openLong, openShort, closeLong, closeShort 的哪一种, 然后将抛出对应事件.

事件在 Engine 中监听, 抓到事件后, 向 Exchange 下达对应的指令.

当 Exchange 完成指令后, Engine 拿到执行结果, 触发 Strategy 的 onOrder, onTrade, 以及 onOpenLong, onOpenShort, onCloseLong, onCloseShort 方法, 在 Strategy 中执行 position, capital 以及 orders 的操作.

至此基本完成整个策略引擎的数据流程.

## 框架代码

参考 github: https://github.com/justinchou/node-quant-framework.git


相关文档: [NodeJS 编写基于事件的量化回测](https://wumingxiaozu.com/2019/09/30/Quant/%E9%87%8F%E5%8C%9624%E5%B0%8F%E6%97%B6%20-%20%E7%AC%AC%E4%B8%89%E9%83%A8%E5%88%86%20NodeJS%20%E7%BC%96%E5%86%99%E5%9F%BA%E4%BA%8E%E4%BA%8B%E4%BB%B6%E7%9A%84%E9%87%8F%E5%8C%96%E5%9B%9E%E6%B5%8B/)

