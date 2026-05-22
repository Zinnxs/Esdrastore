const templateCache = new Map();
const variantCache = new Map();

function normalizeHex(hex) {
  const trimmed = hex.trim().replace('#', '');

  if (trimmed.length === 3) {
    return trimmed
      .split('')
      .map((part) => part + part)
      .join('')
      .toLowerCase();
  }

  return trimmed.slice(0, 6).toLowerCase();
}

function mixHexColor(sourceHex, targetHex, amount) {
  const source = normalizeHex(sourceHex);
  const target = normalizeHex(targetHex);

  const sourceChannels = [0, 2, 4].map((index) => parseInt(source.slice(index, index + 2), 16));
  const targetChannels = [0, 2, 4].map((index) => parseInt(target.slice(index, index + 2), 16));

  const blended = sourceChannels.map((channel, index) => {
    const value = Math.round(channel + (targetChannels[index] - channel) * amount);
    return value.toString(16).padStart(2, '0');
  });

  return `#${blended.join('')}`;
}

function tintSvgTemplate(svgText, colorHex) {
  const lighter = mixHexColor(colorHex, '#ffffff', 0.18);
  const darker = mixHexColor(colorHex, '#000000', 0.24);

  const tintedGradient = svgText.replace(
    /(<linearGradient id="(?!bg)[^"]+"[^>]*>[\s\S]*?<stop offset="0%" stop-color=")[^"]+("[\s\S]*?<stop offset="100%" stop-color=")[^"]+("[\s\S]*?<\/linearGradient>)/,
    `$1${lighter}$2${darker}$3`,
  );

  return tintedGradient;
}

async function loadSvgTemplate(imagePath) {
  if (!templateCache.has(imagePath)) {
    templateCache.set(
      imagePath,
      fetch(imagePath).then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load SVG template: ${imagePath}`);
        }

        return response.text();
      }),
    );
  }

  return templateCache.get(imagePath);
}

export async function getVariantImageUrl(imagePath, colorHex) {
  const cacheKey = `${imagePath}:${normalizeHex(colorHex)}`;

  if (variantCache.has(cacheKey)) {
    return variantCache.get(cacheKey);
  }

  const template = await loadSvgTemplate(imagePath);
  const tintedSvg = tintSvgTemplate(template, colorHex);
  const dataUrl = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(tintedSvg)}`;

  variantCache.set(cacheKey, dataUrl);

  return dataUrl;
}