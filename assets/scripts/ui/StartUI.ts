import { Button, Color, Component, Label, Node, _decorator } from 'cc';
import type { EndingGalleryItem, GameCatalogItem, GameConfig } from '../data/types';
import { applySlicedSprite, spritePaths } from '../core/AssetLibrary';
import { Motion } from '../core/Motion';
import type { GameProgressSummary } from '../core/ProgressStore';
import {
  DESIGN_HEIGHT,
  DESIGN_WIDTH,
  createLabel,
  createNode,
  drawCircle,
  drawEllipse,
  drawPolygon,
  drawRect,
  hexToColor,
} from '../core/NodeFactory';

const { ccclass } = _decorator;

@ccclass('StartUI')
export class StartUI extends Component {
  private titleLabel!: Label;
  private subtitleLabel!: Label;
  private roleLabel!: Label;
  private storyList!: Node;
  private galleryOverlay!: Node;
  private galleryButtonLabel!: Label;
  private galleryTitleLabel!: Label;
  private galleryList!: Node;
  private pageLabel!: Label;
  private prevPageButton!: Button;
  private nextPageButton!: Button;
  private games: GameCatalogItem[] = [];
  private progress: Record<string, GameProgressSummary> = {};
  private endingGallery: Record<string, EndingGalleryItem[]> = {};
  private selectedGameId = '';
  private currentPage = 0;
  private readonly pageSize = 3;
  private startHandler: (() => void) | null = null;
  private gameSelectHandler: ((gameId: string) => void) | null = null;

  build(parent: Node) {
    this.node.parent = parent;
    drawRect(this.node, DESIGN_WIDTH, DESIGN_HEIGHT, hexToColor('#17231b'));

    const sky = createNode('StartSky', this.node, DESIGN_WIDTH, 980, 0, 290);
    drawRect(sky, DESIGN_WIDTH, 980, hexToColor('#d8c08a'));

    const vignetteTop = createNode('StartVignetteTop', this.node, DESIGN_WIDTH, 260, 0, 650);
    drawRect(vignetteTop, DESIGN_WIDTH, 260, hexToColor('#17231b', 105));

    const sun = createNode('OchreSun', this.node, 150, 150, 220, 500);
    drawCircle(sun, 75, hexToColor('#cda45a', 225));

    const farHill = createNode('StartFarHill', this.node, 900, 300, 20, 190);
    drawEllipse(farHill, 900, 300, hexToColor('#6f7b3d'));
    const nearHill = createNode('StartNearHill', this.node, 980, 370, -120, 90);
    drawEllipse(nearHill, 980, 370, hexToColor('#2f5237'));

    const field = createNode('StartField', this.node, DESIGN_WIDTH, 610, 0, -475);
    drawRect(field, DESIGN_WIDTH, 610, hexToColor('#314d2d'));
    const path = createNode('StartPath', this.node, 290, 620, 80, -500);
    drawPolygon(
      path,
      [
        [-45, 310],
        [65, 310],
        [145, -310],
        [-155, -310],
      ],
      hexToColor('#8b6a3d', 205),
    );

    createLabel('GenreMark', this.node, '互动概念寓言', 260, 42, 20, hexToColor('#f4e7c4'), -160, 530);
    this.titleLabel = createLabel('Title', this.node, '', 620, 170, 58, hexToColor('#17231b'), 0, 330);
    this.subtitleLabel = createLabel('Subtitle', this.node, '', 580, 110, 24, hexToColor('#2d2119'), 0, 165);

    createLabel('CatalogTitle', this.node, '选择寓言', 200, 36, 20, hexToColor('#f4e7c4'), -196, 58);
    this.pageLabel = createLabel('CatalogPage', this.node, '', 96, 34, 16, hexToColor('#f4e7c4'), 130, 58);

    const prevPageNode = createNode('PrevPageButton', this.node, 76, 38, 218, 58);
    drawRect(prevPageNode, 76, 38, hexToColor('#5a3a25', 215));
    applySlicedSprite(prevPageNode, spritePaths.buttonBrown);
    this.prevPageButton = prevPageNode.addComponent(Button);
    this.prevPageButton.node.on(Button.EventType.CLICK, () => this.turnPage(-1));
    createLabel('PrevPageLabel', prevPageNode, '上页', 58, 28, 15, hexToColor('#f4e7c4'));

    const nextPageNode = createNode('NextPageButton', this.node, 76, 38, 306, 58);
    drawRect(nextPageNode, 76, 38, hexToColor('#5a3a25', 215));
    applySlicedSprite(nextPageNode, spritePaths.buttonBrown);
    this.nextPageButton = nextPageNode.addComponent(Button);
    this.nextPageButton.node.on(Button.EventType.CLICK, () => this.turnPage(1));
    createLabel('NextPageLabel', nextPageNode, '下页', 58, 28, 15, hexToColor('#f4e7c4'));

    this.storyList = createNode('StoryList', this.node, 620, 270, 0, -110);

    const rolePanel = createNode('RolePanel', this.node, 560, 76, 0, -385);
    drawRect(rolePanel, 560, 76, hexToColor('#f4e7c4', 230));
    applySlicedSprite(rolePanel, spritePaths.panelLight);
    this.roleLabel = createLabel('Role', rolePanel, '', 500, 46, 21, hexToColor('#5a3a25'), 0, 0);

    const startButtonNode = createNode('StartButton', this.node, 520, 86, 0, -540);
    drawRect(startButtonNode, 520, 86, hexToColor('#203b2a'));
    applySlicedSprite(startButtonNode, spritePaths.buttonBrown);
    startButtonNode.addComponent(Button).node.on(Button.EventType.CLICK, () => {
      this.startHandler?.();
    });
    createLabel('StartButtonLabel', startButtonNode, '开始体验', 480, 70, 30, Color.WHITE);

    const galleryButtonNode = createNode('GalleryButton', this.node, 300, 58, 0, -646);
    drawRect(galleryButtonNode, 300, 58, hexToColor('#5a3a25'));
    applySlicedSprite(galleryButtonNode, spritePaths.buttonBrown);
    galleryButtonNode.addComponent(Button).node.on(Button.EventType.CLICK, () => this.showGallery());
    this.galleryButtonLabel = createLabel('GalleryButtonLabel', galleryButtonNode, '结局图鉴', 240, 44, 21, Color.WHITE);

    this.buildGalleryOverlay();
    this.hide();
  }

  setStartHandler(handler: () => void) {
    this.startHandler = handler;
  }

  setGameSelectHandler(handler: (gameId: string) => void) {
    this.gameSelectHandler = handler;
  }

  show(
    games: GameCatalogItem[],
    selectedConfig: GameConfig,
    progress: Record<string, GameProgressSummary> = {},
    endingGallery: Record<string, EndingGalleryItem[]> = {},
  ) {
    this.node.active = true;
    this.games = games;
    this.progress = progress;
    this.endingGallery = endingGallery;
    this.currentPage = this.getPageForGame(selectedConfig.id);
    this.selectGame(selectedConfig.id, false);
  }

  hide() {
    this.node.active = false;
  }

  private selectGame(gameId: string, emit = true) {
    this.selectedGameId = gameId;
    const selected = this.games.find((game) => game.id === gameId) ?? this.games[0];
    if (!selected) {
      return;
    }

    this.currentPage = this.getPageForGame(selected.id);
    this.titleLabel.string = `寓境\n${selected.title}`;
    this.subtitleLabel.string = selected.subtitle;
    this.roleLabel.string = `身份：${selected.playerRole}`;
    const progressInfo = this.progress[selected.id];
    this.galleryButtonLabel.string = progressInfo
      ? `结局图鉴 ${progressInfo.seenEndings}/${progressInfo.totalEndings}`
      : '结局图鉴';
    this.rebuildStoryCards();
    if (this.galleryOverlay.active) {
      this.rebuildGallery();
    }

    if (emit) {
      this.gameSelectHandler?.(selected.id);
    }
  }

  private rebuildStoryCards() {
    [...this.storyList.children].forEach((child) => child.destroy());

    const pageCount = this.getPageCount();
    this.currentPage = Math.min(this.currentPage, pageCount - 1);
    this.pageLabel.string = `${this.currentPage + 1} / ${pageCount}`;
    this.prevPageButton.node.active = pageCount > 1;
    this.nextPageButton.node.active = pageCount > 1;
    this.prevPageButton.interactable = this.currentPage > 0;
    this.nextPageButton.interactable = this.currentPage < pageCount - 1;

    const pageStart = this.currentPage * this.pageSize;
    const visibleGames = this.games.slice(pageStart, pageStart + this.pageSize);
    const spacing = 112;
    const startY = ((visibleGames.length - 1) * spacing) / 2;
    visibleGames.forEach((game, index) => {
      const selected = game.id === this.selectedGameId;
      const y = startY - index * spacing;
      const shadow = createNode(`StoryShadow_${game.id}`, this.storyList, 584, 94, 4, y - 4);
      drawRect(shadow, 584, 94, hexToColor('#17231b', 80));

      const card = createNode(`StoryCard_${game.id}`, this.storyList, 580, 90, 0, y);
      drawRect(card, 580, 90, selected ? hexToColor('#fff3d2', 250) : hexToColor('#f4e7c4', 220));
      applySlicedSprite(card, selected ? spritePaths.panelLight : spritePaths.panelBeige);
      const stripe = createNode('StoryStripe', card, 8, 62, -268, 0);
      drawRect(stripe, 8, 62, hexToColor(selected ? '#cda45a' : '#5a3a25', selected ? 255 : 180));
      createLabel('StoryTitle', card, game.title, 240, 28, 20, hexToColor('#17231b'), -132, 18);
      createLabel('StoryConcept', card, game.conceptName, 160, 28, 16, hexToColor('#9b6c31'), 172, 18);
      createLabel('StorySubtitle', card, game.subtitle, 360, 32, 14, hexToColor('#5a3a25'), -54, -20);
      const progressInfo = this.progress[game.id];
      if (progressInfo) {
        const chip = createNode('StoryProgressChip', card, 144, 30, 204, -22);
        drawRect(chip, 144, 30, hexToColor(selected ? '#203b2a' : '#5a3a25', selected ? 220 : 170));
        createLabel(
          'StoryProgress',
          chip,
          `${progressInfo.seenEndings}/${progressInfo.totalEndings} 结局 · ${progressInfo.plays} 次`,
          132,
          22,
          13,
          hexToColor('#fff3d2'),
        );
      }
      card.addComponent(Button).node.on(Button.EventType.CLICK, () => this.selectGame(game.id));
    });
  }

  private turnPage(delta: number) {
    const pageCount = this.getPageCount();
    this.currentPage = Math.min(pageCount - 1, Math.max(0, this.currentPage + delta));
    const firstGameOnPage = this.games[this.currentPage * this.pageSize];
    if (firstGameOnPage) {
      this.selectGame(firstGameOnPage.id);
      return;
    }
    this.rebuildStoryCards();
  }

  private getPageForGame(gameId: string) {
    const index = this.games.findIndex((game) => game.id === gameId);
    if (index < 0) {
      return 0;
    }
    return Math.floor(index / this.pageSize);
  }

  private getPageCount() {
    return Math.max(1, Math.ceil(this.games.length / this.pageSize));
  }

  private buildGalleryOverlay() {
    this.galleryOverlay = createNode('EndingGalleryOverlay', this.node, DESIGN_WIDTH, DESIGN_HEIGHT, 0, 0);
    drawRect(this.galleryOverlay, DESIGN_WIDTH, DESIGN_HEIGHT, hexToColor('#17231b', 218));
    const panel = createNode('EndingGalleryPanel', this.galleryOverlay, 620, 820, 0, -22);
    drawRect(panel, 620, 820, hexToColor('#f4e7c4', 248));
    applySlicedSprite(panel, spritePaths.panelLight);
    this.galleryTitleLabel = createLabel('EndingGalleryTitle', panel, '', 540, 48, 26, hexToColor('#17231b'), 0, 346);
    createLabel('EndingGallerySubtitle', panel, '已解锁结局会显示标题；未解锁结局只显示探索线索。', 540, 40, 17, hexToColor('#5a3a25'), 0, 300);
    this.galleryList = createNode('EndingGalleryList', panel, 560, 560, 0, 18);

    const closeButton = createNode('CloseGalleryButton', panel, 280, 58, 0, -346);
    drawRect(closeButton, 280, 58, hexToColor('#203b2a'));
    applySlicedSprite(closeButton, spritePaths.buttonBrown);
    closeButton.addComponent(Button).node.on(Button.EventType.CLICK, () => {
      this.galleryOverlay.active = false;
    });
    createLabel('CloseGalleryLabel', closeButton, '返回寓言册', 220, 44, 20, Color.WHITE);
    this.galleryOverlay.active = false;
  }

  private showGallery() {
    this.galleryOverlay.active = true;
    this.rebuildGallery();
    Motion.popIn(this.galleryOverlay, 0.18);
  }

  private rebuildGallery() {
    [...this.galleryList.children].forEach((child) => child.destroy());
    const selected = this.games.find((game) => game.id === this.selectedGameId);
    this.galleryTitleLabel.string = selected ? `${selected.title} · 结局图鉴` : '结局图鉴';
    const entries = this.endingGallery[this.selectedGameId] ?? [];
    if (entries.length === 0) {
      createLabel('NoGalleryData', this.galleryList, '还没有结局数据。', 520, 48, 18, hexToColor('#5a3a25'), 0, 0);
      return;
    }

    const spacing = 104;
    const startY = ((entries.length - 1) * spacing) / 2;
    entries.forEach((entry, index) => {
      const y = startY - index * spacing;
      const row = createNode(`EndingGalleryRow_${entry.id}`, this.galleryList, 560, 88, 0, y);
      drawRect(row, 560, 88, hexToColor(entry.unlocked ? '#fff3d2' : '#d8c08a', entry.unlocked ? 238 : 210));
      applySlicedSprite(row, spritePaths.panelBeige);
      const mark = createNode('EndingGalleryMark', row, 34, 34, -240, 18);
      drawCircle(mark, 16, hexToColor(entry.unlocked ? '#203b2a' : '#8b6a3d', 230));
      createLabel('EndingGalleryMarkText', mark, entry.unlocked ? '✓' : '?', 28, 26, 17, hexToColor('#f4e7c4'));
      createLabel('EndingGalleryRowTitle', row, entry.title, 400, 28, 19, hexToColor('#17231b'), 20, 18);
      createLabel('EndingGalleryRowHint', row, entry.hint, 496, 34, 15, hexToColor('#5a3a25'), 20, -22);
    });
  }
}
