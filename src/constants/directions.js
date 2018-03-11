import { KEY_UP, KEY_RIGHT, KEY_DOWN, KEY_LEFT } from './user-settings';

export const NORTH = 'NORTH';
export const WEST = 'WEST';
export const SOUTH = 'SOUTH';
export const EAST = 'EAST';
export const DIRECTION_KEY_BINDINGS = {
  [KEY_UP]: NORTH,
  [KEY_RIGHT]: EAST,
  [KEY_DOWN]: SOUTH,
  [KEY_LEFT]: WEST
};
export const DIRECTION_VECTORS = {
  NORTH: ({ x, y }, distance) => ({ x, y: y - distance }),
  EAST: ({ x, y }, distance) => ({ x: x + distance, y }),
  SOUTH: ({ x, y }, distance) => ({ x, y: y + distance }),
  WEST: ({ x, y }, distance) => ({ x: x - distance, y })
};
