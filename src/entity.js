import { DIRECTION_VECTORS, SOUTH } from './constants/directions';
import { INANIMATE } from './constants/entities';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants';
import { detectWallCollision, getTileOriginCoordinates } from './map';
import entities from './constants/entities';

export function drawEntity(ctx, entity) {
  if (!entity.sprite) {
    ctx.fillStyle = 'rgb(200, 0, 0)';
    return ctx.fillRect(entity.x, entity.y, entity.dx, entity.dy);
  }
  const { sprite, type, status, direction, x, y, dx, dy } = entity;
  const variantDeterminer = (type === INANIMATE && status) || direction;
  const { x: sx, y: sy } = sprite.images[variantDeterminer];
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

  return { ...entity, direction };
}

function clamp(number, min, max) {
  return Math.min(Math.max(number, min), max);
}

export function spawnEntity(identifier, tileCoordinates, direction = SOUTH) {
  const coordinates = getTileOriginCoordinates(tileCoordinates);
  const entity = entities[identifier]({
    direction,
    ...coordinates
  });

  return entity;
}
