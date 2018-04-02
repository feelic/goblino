/* globals console */
import {
  KEY_UP,
  KEY_RIGHT,
  KEY_DOWN,
  KEY_LEFT,
  KEY_ACTION
} from './constants/user-settings';
import {
  DIRECTION_KEY_BINDINGS,
  NORTH,
  EAST,
  SOUTH,
  WEST
} from './constants/directions';
import { PLAYER_MOVE_SPEED, TILE_SIZE, HALF_TILE } from './constants';
import { INANIMATE } from './constants/entities';
import { moveEntity } from './entity';
import { clearKey } from './keyboard-controller';
import { detectEntityCollision } from './map';

export default {
  [KEY_UP]: state => movePlayer(state, KEY_UP),
  [KEY_RIGHT]: state => movePlayer(state, KEY_RIGHT),
  [KEY_DOWN]: state => movePlayer(state, KEY_DOWN),
  [KEY_LEFT]: state => movePlayer(state, KEY_LEFT),
  [KEY_ACTION]: state => playerAct(state, KEY_ACTION)
};

function movePlayer(state, key) {
  const direction = DIRECTION_KEY_BINDINGS[key];

  state.player = moveEntity(state.player, direction, PLAYER_MOVE_SPEED);
}

function playerAct(state, key) {
  clearKey(key);

  const target = findActionTarget(state);

  if (!target || !target.activate) {
    return;
  }
  const event = target.activate();

  if (event.loot && event.loot.gold) {
    state.gold += event.loot.gold;
  }
}
function findActionTarget(state) {
  const { x, y, dx, dy, direction } = state.player;
  const entities = state.entities[INANIMATE];
  const search = defineSearchBox({ x, y, dx, dy }, direction);

  return detectEntityCollision(entities, search);
}
function defineSearchBox(origin, direction) {
  const { x, y } = origin;

  const search = {
    x,
    y,
    dx: TILE_SIZE,
    dy: TILE_SIZE
  };
  if (direction === NORTH) {
    search.y -= HALF_TILE;
    search.dy = HALF_TILE;
  }
  if (direction === WEST) {
    search.x -= HALF_TILE;
    search.dx = HALF_TILE;
  }
  if (direction === SOUTH) {
    search.y += TILE_SIZE;
    search.dy = HALF_TILE;
  }
  if (direction === EAST) {
    search.x += TILE_SIZE;
    search.dx = HALF_TILE;
  }
  return search;
}
