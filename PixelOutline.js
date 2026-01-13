import polygonize from '/PRIXELS/src/js/polygonize.js';
import pathologize from '/PRIXELS/src/js/pathologize.js';

export class PixelOutline {
  /**
   * @param {string} svgString - SVG XML as string
   * @param {number} initialDots - Initial number of dots
   * @param {number} scale - Scale factor for the dots (default 1)
   * @param {number} translateX - X translation (default 0)
   * @param {number} translateY - Y translation (default 0)
   */
  constructor(svgString, initialDots = 10, scale = 1, translateX = 0, translateY = 0) {
    this.svgString = svgString;
    this.numDots = initialDots;
    this.scale = scale;
    this.translateX = translateX;
    this.translateY = translateY;
    this.path = this._extractPath(svgString);
  }

  // Extracts the first <path> element from the SVG string
  _extractPath(svgString) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.innerHTML = pathologize(svgString);
    const path = svg.querySelector('path');
    if (!path) throw new Error('No <path> found in SVG');
    return path;
  }

  // Returns the current array of [x, y] dot coordinates
  getDots() {
    return polygonize(
      this.path,
      this.numDots,
      this.scale,
      this.translateX,
      this.translateY
    );
  }

  // Increases the number of dots by a given amount
  addDots(amount = 5) {
    this.numDots += amount;
  }

  // Sets the number of dots directly
  setDots(n) {
    this.numDots = n;
  }
}