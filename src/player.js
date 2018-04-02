/* globals Image */
import { TILE_SIZE } from './constants';
import { NORTH, WEST, SOUTH, EAST } from './constants/directions';
import goblin from './assets/goblin-sprite.png';

const playerImage = new Image();
playerImage.src = goblin;

export default {
  x: TILE_SIZE,
  y: TILE_SIZE,
  direction: SOUTH,
  dx: 1 * TILE_SIZE - 1,
  dy: 1 * TILE_SIZE - 1,
  hitbox: 'circle',
  sprite: {
    asset: playerImage,
    images: {
      [NORTH]: { x: 0, y: 0 },
      [EAST]: { x: 30, y: 0 },
      [SOUTH]: { x: 60, y: 0 },
      [WEST]: { x: 90, y: 0 }
    }
  }
};
