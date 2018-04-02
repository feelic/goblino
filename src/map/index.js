import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  TILE_SIZE,
  HALF_TILE
} from '../constants';
import tileset from './tileset';
import { getMapData } from './map-loader';

const TILE_COUNT_X = CANVAS_WIDTH / TILE_SIZE;
const TILE_COUNT_Y = CANVAS_HEIGHT / TILE_SIZE;

export function drawMap(ctx /*, player*/) {
  const mapData = getMapData();

  for (let x = 0; x < TILE_COUNT_X; x += 1) {
    for (let y = 0; y < TILE_COUNT_Y; y += 1) {
      const { image, imageVariant } = mapData[x][y];
      const { x: sx, y: sy } = tileset.images[image][imageVariant];

      ctx.drawImage(
        tileset.asset,
        sx,
        sy,
        TILE_SIZE,
        TILE_SIZE,
        x * TILE_SIZE,
        y * TILE_SIZE,
        TILE_SIZE,
        TILE_SIZE
      );
    }
  }
}

export function detectWallCollision(entity) {
  const mapData = getMapData();
  const leftTile = Math.floor(entity.x / TILE_SIZE);
  const rightTile = Math.floor((entity.x + entity.dx) / TILE_SIZE);
  const topTile = Math.floor(entity.y / TILE_SIZE);
  const bottomTile = Math.floor((entity.y + entity.dy) / TILE_SIZE);

  for (let x = leftTile; x <= rightTile; x += 1) {
    for (let y = topTile; y <= bottomTile; y += 1) {
      if (mapData[x][y].blocking) {
        return true;
      }
    }
  }

  return false;
}

export function detectEntityCollision(entities, entity) {
  for (let i = 0; i < entities.length; i += 1) {
    const e = entities[i];

    if (
      e.x < entity.x + entity.dx &&
      e.x + e.dx > entity.x &&
      e.y < entity.y + entity.dy &&
      e.dy + e.y > entity.y
    ) {
      return e;
    }
  }
}

export function getTileOriginCoordinates(tileCoordinates) {
  const { x, y } = tileCoordinates;
  return {
    x: x * TILE_SIZE,
    y: y * TILE_SIZE
  };
}
export function getTileCenterCoordinates(tileCoordinates) {
  const { x, y } = tileCoordinates;
  return {
    x: x * TILE_SIZE + HALF_TILE,
    y: y * TILE_SIZE + HALF_TILE
  };
}
