/* globals Image */
import tileset from '../assets/goblino-tiles.png';
import { TILE_SIZE } from '../constants';

const tileImage = new Image();

tileImage.src = tileset;

function tileXY(x, y) {
  return { x: x * TILE_SIZE, y: y * TILE_SIZE };
}

const images = {
  floor: [
    tileXY(0, 0),
    tileXY(1, 0),
    tileXY(2, 0),
    tileXY(3, 0),
    tileXY(4, 0),
    tileXY(5, 0),
    tileXY(6, 0),
    tileXY(7, 0),
    tileXY(8, 0)
  ],
  ceiling0: [tileXY(0, 1), tileXY(0, 2)],
  ceiling1: [tileXY(1, 1)],
  ceiling2: [tileXY(2, 1)],
  ceiling3: [tileXY(3, 1)],
  ceiling4: [tileXY(4, 1)],
  ceiling5: [tileXY(5, 1), tileXY(5, 2), tileXY(5, 3), tileXY(5, 4)],
  ceiling6: [tileXY(6, 1)],
  ceiling7: [tileXY(7, 1), tileXY(7, 2), tileXY(7, 3), tileXY(7, 4)],
  ceiling8: [tileXY(8, 1)],
  ceiling9: [tileXY(9, 1)],
  ceiling10: [tileXY(10, 1), tileXY(10, 2), tileXY(10, 3), tileXY(10, 4)],
  ceiling11: [tileXY(11, 1), tileXY(11, 2), tileXY(11, 3), tileXY(11, 4)],
  ceiling12: [tileXY(12, 1)],
  ceiling13: [tileXY(13, 1), tileXY(13, 2), tileXY(13, 3), tileXY(13, 4)],
  ceiling14: [tileXY(14, 1), tileXY(14, 2), tileXY(14, 3), tileXY(14, 4)],
  ceiling15: [tileXY(15, 1)],
  ceiling16: [tileXY(16, 1)],
  wall: [
    tileXY(3, 5),
    tileXY(4, 5),
    tileXY(5, 5),
    tileXY(6, 5),
    tileXY(3, 6),
    tileXY(4, 6),
    tileXY(5, 6),
    tileXY(6, 6)
  ],
  wallLeftCorner: [tileXY(0, 5), tileXY(0, 6)],
  wallRightCorner: [tileXY(1, 5), tileXY(1, 6)],
  wallBothCorners: [tileXY(2, 5), tileXY(2, 6)]
};
export default {
  asset: tileImage,
  images
};

export function getTileVariant(image) {
  if (images[image].length === 1) {
    return { image, imageVariant: 0 };
  }

  const variants = images[image];
  const imageVariant = Math.floor(Math.random() * variants.length);

  return { image, imageVariant };
}
