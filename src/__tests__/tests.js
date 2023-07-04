import { calcTileType } from '../js/Board/utils';

describe('calcTileType', () => {
  test.each([
    [0, 8, 'top-left'],
    [7, 8, 'top-right'],
    [56, 8, 'bottom-left'],
    [63, 8, 'bottom-right'],
    [1, 8, 'top'],
    [57, 8, 'bottom'],
    [8, 8, 'left'],
    [15, 8, 'right'],
    [27, 8, 'center'],
  ])('%s index ячейки и размер поля %s должны вернуть значение %s типа ячейки', (index, boardSize, expected) => {
    expect(calcTileType(index, boardSize)).toBe(expected);
  });
});
