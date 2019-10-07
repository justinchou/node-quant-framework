const parseFloor = (v, decimals) => {
  // 整数 - 直接补 0
  if (`${v}`.indexOf('.') === -1) return `${v}.${''.padEnd(decimals, '0')}`;

  const [intValue, floatValue = ''] = `${v}`.split('.');

  // 小数部分小于等于要求 - 补齐 0
  if (floatValue.length <= decimals) {
    return `${intValue}.${floatValue.padEnd(decimals - floatValue.length + 1, '0')}`;
  }

  // 小数部分长于要求 - 直接截取 取 floor
  return `${intValue}.${floatValue.slice(0, decimals)}`;
};
exports.parseFloor = parseFloor;

const parseFloorDecimal = (v, decimals) => parseFloat(parseFloor(v, decimals));
exports.parseFloorDecimal = parseFloorDecimal;

const parseCeil = (v, decimals) => {
  // 整数 - 直接补 0
  if (`${v}`.indexOf('.') === -1) return `${v}.${''.padEnd(decimals, '0')}`;

  const [intValue, floatValue = ''] = `${v}`.split('.');

  // 小数部分小于等于要求 - 补齐 0
  if (floatValue.length <= decimals) {
    return `${intValue}.${floatValue.padEnd(decimals - floatValue.length + 1, '0')}`;
  }

  // 小数部分长于要求 - 直接截取差一位
  const part1 = `${intValue}.${floatValue.slice(0, decimals - 1)}`;

  const part3 = floatValue.slice(decimals - 1, decimals).replace(/0/g, '');

  // 最后一位的后面还有数据, 最后一位直接加 1; 最后一位的后面没有数据, 或者全部是 0, 最后一位不变
  const part2 = part3
    ? `${parseInt(floatValue.slice(decimals - 1, decimals), 10) + 1}`
    : `${parseInt(floatValue.slice(decimals - 1, decimals), 10)}`;

  return `${part1}${part2}`;
};
exports.parseCeil = parseCeil;

const parseCeilDecimal = (v, decimals) => parseFloat(parseCeil(v, decimals));
exports.parseCeilDecimal = parseCeilDecimal;
