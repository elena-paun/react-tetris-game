import React, { useState, useEffect } from 'react';
import { createStage } from '../gameHelpers';

import type { PLAYER } from './usePlayer';
import type { STAGECELL, STAGE } from '../components/Stage/Stage';

export const useStage = (player: PLAYER, resetPlayer: () => void) => {
  const [stage, setStage] = useState(createStage());
  const [rowsCleared, setRowsCleared] = useState(0);
  useEffect(() => {
    if (!player.pos) return;
    setRowsCleared(0);
    const sweepRows = (newStage: STAGE): STAGE => {
      return newStage.reduce((acc, row) => {
        // if we don't find a 0, it means the row is full and it should be cleared
        if (row.findIndex((cell) => cell[0] === 0) === -1) {
          setRowsCleared((prev) => prev + 1);
          // create empty row at beggining of array to push the tetrominos down instead of returning the cleared rows
          acc.unshift(
            new Array(newStage[0].length).fill([0, 'clear']) as STAGECELL[]
          );
          return acc;
        }
        acc.push(row);
        return acc;
      }, [] as STAGE);
    };
    const updateStage = (prevStage: STAGE): STAGE => {
      const newStage = prevStage.map(
        (row) =>
          row.map((cell) =>
            cell[1] === 'clear' ? [0, 'clear'] : cell
          ) as STAGECELL[]
      );
      player.tetromino.forEach((row, y) => {
        row.forEach((value: any, x) => {
          if (value !== 0) {
            newStage[y + player.pos.y][x + player.pos.x] = [
              value,
              `${player.collided ? 'merged' : 'clear'}`,
            ];
          }
        });
      });
      if (player.collided) {
        resetPlayer();
        return sweepRows(newStage);
      }
      return newStage;
    };
    setStage((prev) => updateStage(prev));
  }, [player.collided, player.pos?.x, player.pos?.y, player.tetromino]);
  return { stage, setStage, rowsCleared };
};
