/* globals Image */
import { TILE_SIZE } from './index';

export const INANIMATE = 'INANIMATE';
export const DEBUG_ENTITIES = 'DEBUG';

export const OPEN = 'OPEN';
export const CLOSED = 'CLOSED';

import chestSprite from '../assets/chest-sprite.png';
const chestImage = new Image();
chestImage.src = chestSprite;

const types = {
  chest: {
    loot: { gold: 10 },
    type: INANIMATE,
    status: CLOSED,
    dx: 1 * TILE_SIZE - 1,
    dy: 1 * TILE_SIZE - 1,
    sprite: {
      asset: chestImage,
      images: {
        [OPEN]: { x: 32, y: 0 },
        [CLOSED]: { x: 0, y: 0 }
      }
    },
    activate: function() {
      const loot = this.loot;

      this.status = this.status === OPEN ? CLOSED : OPEN;
      this.loot = {};

      return { loot };
    }
  }
};

export default Object.keys(types).reduce((prev, curr) => {
  return {
    ...prev,
    [curr]: properties => {
      return {
        ...types[curr],
        ...properties
      };
    }
  };
}, {});
