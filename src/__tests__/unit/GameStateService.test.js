import GameStateService from '../../js/GameStateService';
import GamePlay from '../../js/GamePlay';

// Создаем мок для объекта storage
const mockStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
};

const gamePlayMock = new GamePlay();
gamePlayMock.showError = jest.fn();
gamePlayMock.showMessage = jest.fn();

// Создаем экземпляр GameStateService с моками
const gameStateService = new GameStateService(mockStorage);

describe('GameStateService', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Очищаем вызовы моков после каждого теста
  });

  it('игра успешно загрузилась', () => {
    const mockState = {
      activePlayer: 0,
      computerMoveDone: true,
      currentTheme: 'prairie',
      enemiesPositionedCharacters: [
        {
          character: {
            level: 1, attack: 20, defence: 30, health: 1, type: 'daemon', moveDistance: 1, attackDistance: 4,
          },
          position: 54,
        },
        {
          character: {
            level: 1, attack: 20, defence: 30, health: 1, type: 'daemon', moveDistance: 1, attackDistance: 4,
          },
          position: 62,
        },
      ],
      isGameFieldLocked: false,
      playerPositionedCharacters: [
        {
          character: {
            level: 1, attack: 40, defence: 15, health: 1, type: 'swordsman', moveDistance: 4, attackDistance: 1,
          },
          position: 40,
        },
        {
          character: {
            level: 1, attack: 25, defence: 25, health: 1, type: 'bowman', moveDistance: 2, attackDistance: 2,
          },
          position: 49,
        },
      ],
    };
    mockStorage.getItem.mockReturnValue(JSON.stringify(mockState));
    const loadedState = gameStateService.load();
    expect(loadedState).toEqual(mockState);
    // expect(gamePlayMock.showMessage).toHaveBeenCalledWith('Игровое сохранение загружено');
  });

  it('игра не смогла загрузиться', () => {
    mockStorage.getItem.mockReturnValue('fdfdsfd');
    expect(() => gameStateService.load()).toThrow('Invalid state');
    // expect(gamePlayMock.showError).toHaveBeenCalledWith('Сохранение не найдено');
  });
});
