import { Node, Tween, UIOpacity, Vec3, tween } from 'cc';

const ensureOpacity = (node: Node) => node.getComponent(UIOpacity) ?? node.addComponent(UIOpacity);

export class Motion {
  static popIn(node: Node, duration = 0.16, delay = 0) {
    if (!node.isValid) {
      return;
    }

    const opacity = ensureOpacity(node);
    Tween.stopAllByTarget(node);
    Tween.stopAllByTarget(opacity);
    node.setScale(0.96, 0.96, 1);
    opacity.opacity = 0;
    tween(node)
      .delay(delay)
      .to(duration, { scale: new Vec3(1, 1, 1) }, { easing: 'quadOut' })
      .start();
    tween(opacity)
      .delay(delay)
      .to(duration, { opacity: 255 }, { easing: 'quadOut' })
      .start();
  }

  static pulse(node: Node, scale = 1.035, duration = 0.1) {
    if (!node.isValid) {
      return;
    }

    Tween.stopAllByTarget(node);
    node.setScale(1, 1, 1);
    tween(node)
      .to(duration, { scale: new Vec3(scale, scale, 1) }, { easing: 'quadOut' })
      .to(duration, { scale: new Vec3(1, 1, 1) }, { easing: 'quadIn' })
      .start();
  }
}
