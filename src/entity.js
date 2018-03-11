import { DIRECTION_VECTORS } from './constants/directions';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants';
import { detectWallCollision } from './map';

export function drawEntity(ctx, entity) {
  if (!entity.sprite) {
    ctx.fillStyle = 'rgb(200, 0, 0)';
    return ctx.fillRect(entity.x, entity.y, entity.dx, entity.dy);
  }
  const { sprite, direction, x, y, dx, dy } = entity;
  const { x: sx, y: sy } = sprite.images[direction];
  ctx.drawImage(sprite.asset, sx, sy, dx, dy, x, y, dx, dy);
}

export function moveEntity(entity, direction, distance) {
  const { x, y } = DIRECTION_VECTORS[direction](entity, distance);
  const newEntity = {
    ...entity,
    x: clamp(x, 0, CANVAS_WIDTH - entity.dx),
    y: clamp(y, 0, CANVAS_HEIGHT - entity.dy),
    direction
  };

  if (!detectWallCollision(newEntity)) {
    return newEntity;
  }

  return entity;
}

function clamp(number, min, max) {
  return Math.min(Math.max(number, min), max);
}
