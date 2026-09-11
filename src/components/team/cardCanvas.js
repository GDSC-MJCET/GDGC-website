// Shared by the team carousels: WebGL can't render HTML/CSS card chrome onto
// a mesh, so each "card" is composited onto an offscreen 2D canvas — photo,
// border, bottom scrim, and baked-in name/role text — and that canvas
// becomes the texture.
export const CARD_W = 600;
export const CARD_H = 800;
export const CARD_RADIUS = 28;

function roundedRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export function buildCardCanvas(image, member) {
  const canvas = document.createElement("canvas");
  canvas.width = CARD_W;
  canvas.height = CARD_H;
  const ctx = canvas.getContext("2d");

  roundedRectPath(ctx, 0, 0, CARD_W, CARD_H, CARD_RADIUS);
  ctx.save();
  ctx.clip();

  ctx.fillStyle = "#0F1211";
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  if (image) {
    // object-fit: cover, biased toward the top so faces aren't cropped out.
    const scale = Math.max(CARD_W / image.width, CARD_H / image.height) * 1.08;
    const drawW = image.width * scale;
    const drawH = image.height * scale;
    const dx = (CARD_W - drawW) / 2;
    const dy = (CARD_H - drawH) * 0.12;
    ctx.drawImage(image, dx, dy, drawW, drawH);
  }

  const gradient = ctx.createLinearGradient(0, CARD_H * 0.6, 0, CARD_H);
  gradient.addColorStop(0, "rgba(12,14,13,0)");
  gradient.addColorStop(1, "rgba(12,14,13,0.95)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, CARD_H * 0.55, CARD_W, CARD_H * 0.45);

  ctx.restore();

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "600 34px Inter, sans-serif";
  ctx.fillText(member.name, 32, CARD_H - 64);

  ctx.fillStyle = "rgba(255,255,255,0.65)";
  ctx.font = "400 24px Inter, sans-serif";
  ctx.fillText(member.role, 32, CARD_H - 30);

  roundedRectPath(ctx, 1, 1, CARD_W - 2, CARD_H - 2, CARD_RADIUS);
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 2;
  ctx.stroke();

  return canvas;
}
