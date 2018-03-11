/* globals Image, document */
import mapFile from '../assets/map.png';
import { NORTH, EAST, SOUTH, WEST } from '../constants/directions';
import { getTileVariant } from './tileset';

const mapData = [];

export function loadMapData() {
  const img = new Image();
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  return new Promise(resolve => {
    img.src = mapFile;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);

      decodeMapData(ctx, img.width, img.height);
      resolve();
    };
  });
}

export function decodeMapData(ctx, width, height) {
  const rawData = [];

  for (let x = 0; x < width; x += 1) {
    rawData.push([]);
    for (let y = 0; y < height; y += 1) {
      rawData[x].push(ctx.getImageData(x, y, 1, 1).data);
    }
  }

  for (let x = 0; x < width; x += 1) {
    mapData.push([]);
    for (let y = 0; y < height; y += 1) {
      const neighbours = {
        [NORTH]: rawData[x][y - 1] || [0],
        [NORTH + EAST]: (rawData[x + 1] && rawData[x + 1][y - 1]) || [0],
        [EAST]: (rawData[x + 1] && rawData[x + 1][y]) || [0],
        [SOUTH + EAST]: (rawData[x + 1] && rawData[x + 1][y + 1]) || [0],
        [SOUTH]: rawData[x][y + 1] || [0],
        [SOUTH + WEST]: (rawData[x - 1] && rawData[x - 1][y + 1]) || [0],
        [WEST]: (rawData[x - 1] && rawData[x - 1][y]) || [0],
        [NORTH + WEST]: (rawData[x - 1] && rawData[x - 1][y - 1]) || [0]
      };

      mapData[x].push(decodeTileInfo(rawData[x][y], neighbours));
    }
  }
}

export function decodeTileInfo(tileInfo, neighbours) {
  const northBlocking = neighbours[NORTH][0] === 0;
  const eastBlocking = neighbours[EAST][0] === 0;
  const southBlocking = neighbours[SOUTH][0] === 0;
  const westBlocking = neighbours[WEST][0] === 0;
  const neighboursValue =
    northBlocking * 8 + eastBlocking * 4 + southBlocking * 2 + westBlocking * 1;

  if (tileInfo[0] === 0) {
    const imageId = `ceiling${neighboursValue}`;

    return { blocking: true, ...getTileVariant(imageId) };
  }

  if (northBlocking) {
    return { blocking: false, ...getTileVariant('wall') };
  }

  return { blocking: false, ...getTileVariant('floor') };
}

export function getMapData() {
  return mapData;
}

function getNeighbourBlockMatrix() {}
