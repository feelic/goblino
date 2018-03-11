/* globals document, window */
import { drawEntity } from './entity';
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

const state = { player };
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

async function startGame() {
  startKeyboardController(playerControls);
  await loadMapData();
  gameLoop();
}

function gameLoop() {
  registerKeyboardEvents(state);
  DEBUG && renderDebugInfo(state);

  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  drawMap(ctx, state.player);
  drawEntity(ctx, state.player);

  window.requestAnimationFrame(gameLoop);
}

startGame();
