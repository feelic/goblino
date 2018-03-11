import {
  KEY_UP,
  KEY_RIGHT,
  KEY_DOWN,
  KEY_LEFT
} from './constants/user-settings';
import { DIRECTION_KEY_BINDINGS } from './constants/directions';
import { PLAYER_MOVE_SPEED } from './constants';
import { moveEntity } from './entity';

export default {
  [KEY_UP]: state => movePlayer(state, KEY_UP),
  [KEY_RIGHT]: state => movePlayer(state, KEY_RIGHT),
  [KEY_DOWN]: state => movePlayer(state, KEY_DOWN),
  [KEY_LEFT]: state => movePlayer(state, KEY_LEFT)
};

function movePlayer(state, key) {
  const direction = DIRECTION_KEY_BINDINGS[key];

  state.player = moveEntity(state.player, direction, PLAYER_MOVE_SPEED);
}
