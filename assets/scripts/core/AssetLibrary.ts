import { Node, Sprite, SpriteFrame, Texture2D, resources } from 'cc';

const SPRITE_TYPE_SIMPLE = 0;
const SPRITE_TYPE_SLICED = 1;
const SPRITE_SIZE_CUSTOM = 0;

export const spritePaths = {
  panelBeige: 'images/ui/panel_beige',
  panelLight: 'images/ui/panel_beigeLight',
  panelBrown: 'images/ui/panel_brown',
  buttonBrown: 'images/ui/buttonLong_brown',
  buttonBeige: 'images/ui/buttonLong_beige',
} as const;

export const applySprite = (node: Node, path: string, type = SPRITE_TYPE_SIMPLE) => {
  const sprite = node.getComponent(Sprite) ?? node.addComponent(Sprite);
  sprite.type = type;
  sprite.sizeMode = SPRITE_SIZE_CUSTOM;
  resources.load(path, Texture2D, (error, texture) => {
    if (error || !texture || !node.isValid) {
      return;
    }
    const frame = new SpriteFrame();
    frame.texture = texture;
    sprite.spriteFrame = frame;
  });
  return sprite;
};

export const applySlicedSprite = (node: Node, path: string) => applySprite(node, path, SPRITE_TYPE_SLICED);
