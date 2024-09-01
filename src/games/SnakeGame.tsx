import React, { useState, useEffect } from 'react';
import './SnakeGame.css';

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<number[][]>([[2, 2]]);
  const [direction, setDirection] = useState<string>('RIGHT');
  const [food, setFood] = useState<number[]>([
    Math.floor(Math.random() * 10),
    Math.floor(Math.random() * 10),
  ]);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isGameOver) return;

      const newSnake = [...snake];
      const head = newSnake[newSnake.length - 1];

      let newHead: [number, number] | undefined; // Aquí se define correctamente el tipo

      switch (direction) {
        case 'UP':
          newHead = [head[0], head[1] - 1];
          break;
        case 'DOWN':
          newHead = [head[0], head[1] + 1];
          break;
        case 'LEFT':
          newHead = [head[0] - 1, head[1]];
          break;
        case 'RIGHT':
          newHead = [head[0] + 1, head[1]];
          break;
        default:
          return;
      }

      // Verificar colisión con la pared
      if (
        newHead[0] < 0 ||
        newHead[0] >= 10 ||
        newHead[1] < 0 ||
        newHead[1] >= 10
      ) {
        setIsGameOver(true);
        clearInterval(interval);
        return;
      }

      // Verificar colisión con sí mismo
      if (newSnake.some(segment => segment[0] === newHead![0] && segment[1] === newHead![1])) {
        setIsGameOver(true);
        clearInterval(interval);
        return;
      }

      newSnake.push(newHead);

      // Verificar si la serpiente ha comido la comida
      if (newHead[0] === food[0] && newHead[1] === food[1]) {
        setFood([
          Math.floor(Math.random() * 10),
          Math.floor(Math.random() * 10),
        ]);
      } else {
        newSnake.shift();
      }

      setSnake(newSnake);
    }, 200);

    return () => clearInterval(interval);
  }, [snake, direction, isGameOver, food]);

  return (
    <div>
      <h2>Snake Game</h2>
      {isGameOver ? (
        <div>
          <h3>Game Over</h3>
          <button onClick={() => {
            setSnake([[2, 2]]);
            setDirection('RIGHT');
            setFood([
              Math.floor(Math.random() * 10),
              Math.floor(Math.random() * 10),
            ]);
            setIsGameOver(false);
          }}>Restart Game</button>
        </div>
      ) : (
        <div className="snake-game-board">
          {[...Array(10)].map((_, row) => (
            <div key={row} className="snake-game-row">
              {[...Array(10)].map((_, col) => {
                const isSnakeSegment = snake.some(
                  segment => segment[0] === col && segment[1] === row
                );
                const isFood = food[0] === col && food[1] === row;
                return (
                  <div
                    key={col}
                    className={`snake-game-cell ${isSnakeSegment ? 'snake' : ''} ${isFood ? 'food' : ''}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SnakeGame;
