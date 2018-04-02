/* globals document, window */
import { drawEntity, spawnEntity } from './entity';
import { INANIMATE, DEBUG_ENTITIES } from './constants/entities';
import { drawMap } from './map';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants';
import {
  registerKeyboardEvents,
  startKeyboardController
} from './keyboard-controller';
import player from './player';
import playerControls from './player-controls';
import { renderDebugInfo } from './debug-tools';
import { DEBUG } from './constants/user-settings';
import { loadMapData } from './map/map-loader';
import { drawGui } from './gui';

const state = {
  gold: 0,
  player,
  entities: {
    [INANIMATE]: [],
    [DEBUG_ENTITIES]: []
  }
};
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

async function startGame() {
  startKeyboardController(playerControls);
  await loadMapData();
  state.entities[INANIMATE].push(spawnEntity('chest', { x: 4, y: 4 }));
  gameLoop();
}

function gameLoop() {
  registerKeyboardEvents(state);
  DEBUG && renderDebugInfo(state);

  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  drawMap(ctx, state.player);

  state.entities[INANIMATE].forEach(entity => {
    drawEntity(ctx, entity);
  });
  state.entities[DEBUG_ENTITIES].forEach(entity => {
    drawEntity(ctx, entity);
  });

  drawEntity(ctx, state.player);
  drawGui(ctx, state);

  window.requestAnimationFrame(gameLoop);
}

startGame();
