import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants';

export function drawGui(ctx, state) {
  ctx.fillStyle = 'rgb(156, 144, 135)';
  ctx.fillRect(CANVAS_WIDTH - 40, CANVAS_HEIGHT - 40, 30, 30);
  ctx.fillStyle = 'rgb(56, 44, 35)';
  ctx.font = '24px serif';
  ctx.fillText(state.gold, CANVAS_WIDTH - 36, CANVAS_HEIGHT - 16);
}
