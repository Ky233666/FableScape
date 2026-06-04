# 寓境 FableScape

「寓境 FableScape」是一个 Cocos Creator 3.8.x 的互动式概念寓言游戏框架。当前内置《草场的一天》和《石桥的约定》两个示例，分别用于讲解“公地悲剧”和“囚徒困境”。

这版已经删除 React/Vite 网页原型，改为 Cocos TypeScript 组件架构。第一版场景和角色使用运行时占位图形，UI 面板与按钮接入 Kenney CC0 素材，方便后续替换为 AI 生成图片、Prefab 和音效。

## 技术栈

- Cocos Creator 3.8.x
- TypeScript
- Cocos 内置 UI、场景、Tween、AudioSource
- 配置驱动剧情、状态、选择、反馈和结局
- 首发目标：Web Mobile H5
- 后续可扩展微信小游戏、抖音小游戏

## 当前实现

- 标题页寓言册，可选择不同故事配置
- 5 轮《草场的一天》玩法和 5 轮《石桥的约定》玩法
- 4 个状态变量：个人财富、草场健康、村庄信任、规则支持
- 选择后状态变化、反馈文本、羊群变化、草场变化、村民情绪变化、规则牌/围栏变化
- 4 个主要结局：草场崩溃、短期获利、制度治理、保守但无力
- 结局页解释“公地悲剧”和故事隐喻
- `GameConfig` 驱动内容，UI 状态条根据配置自动生成

## 项目结构

```text
assets/
  scenes/
  scripts/
    core/
      FableScapeBootstrap.ts
      GameManager.ts
      GameState.ts
      ConfigLoader.ts
      EventCenter.ts
      EndingEvaluator.ts
      EffectApplier.ts
      NodeFactory.ts
    data/
      types.ts
      commonsTragedyConfig.ts
    ui/
      StartUI.ts
      DialogPanel.ts
      ChoicePanel.ts
      StatusPanel.ts
      FeedbackPanel.ts
      EndingPanel.ts
      ProgressIndicator.ts
    gameplay/
      GrasslandController.ts
      SheepController.ts
      VillagerController.ts
      PlayerController.ts
      VisualStateController.ts
      CameraController.ts
      AudioController.ts
  prefabs/
  resources/
    images/
      ui/
    audio/
    configs/
settings/
  project.json
```

## 如何在 Cocos Creator 中运行

项目已经内置启动场景：

```text
assets/scenes/Start.scene
```

如果打开项目后看到的是 Cocos 默认的 `Untitled` 空场景，说明编辑器停留在未保存的新场景，不代表项目是空的。请在 Assets 面板中刷新 `assets/scenes`，然后双击 `Start.scene` 打开。

本机已验证的编辑器安装位置：

```text
D:\CocosCreator\3.8.6\CocosCreator.exe
```

可以用脚本打开项目：

```powershell
.\tools\open-cocos-project.ps1
```

该脚本会把 Cocos 用户数据目录指定到：

```text
D:\CocosCreator\UserData
```

操作步骤：

1. 用 Cocos Creator 3.8.x 打开本项目目录。
2. 在 Assets 面板打开 `assets/scenes/Start.scene`。
3. 确认 Hierarchy 中有 `Canvas` 节点。
4. 选中 `Canvas`，Inspector 中应能看到 `FableScapeBootstrap` 组件。
5. 点击 Preview。

预览后，`FableScapeBootstrap` 会自动创建草场、牧羊人、羊群、村民、状态面板、选择按钮、反馈面板和结局页。

## 如何发布 Web Mobile H5

1. Cocos Creator 顶部菜单打开 Build。
2. Platform 选择 `Web Mobile`。
3. Start Scene 选择 `Start.scene`。
4. 构建并运行。

建议设计分辨率保持：

- Width: `720`
- Height: `1560`
- Fit Width: 开启
- Fit Height: 关闭

## 如何修改《草场的一天》

编辑：

```text
assets/scripts/data/commonsTragedyConfig.ts
```

常用字段：

- `initialState`：初始变量
- `stateLabels`：状态条标签与范围
- `rounds`：5 轮剧情、选择和反馈
- `choices.effects`：选择对变量的影响
- `choices.visualReaction`：选择后的画面反应
- `choices.soundCue`：选择后的音效提示
- `endings`：结局条件、解释和最终视觉状态
- `visualTheme.world`：当前视觉世界，例如 `grassland` 或 `bridge`
- `visualTheme.stateBindings`：把任意状态变量绑定到资源健康、个人收益、信任和治理强度

## 如何新增一个概念游戏

1. 在 `assets/scripts/data/` 新增配置，例如：

```text
prisonersDilemmaConfig.ts
```

2. 按 `types.ts` 中的 `GameConfig` 填写：

- `id`
- `title`
- `conceptName`
- `playerRole`
- `initialState`
- `stateLabels`
- `rounds`
- `endings`
- `metaphorMapping`
- `visualTheme`

其中 `visualTheme.stateBindings` 决定通用视觉层读取哪些变量：

```ts
visualTheme: {
  world: 'bridge',
  stateBindings: {
    resourceKey: 'bridgeSafety',
    wealthKey: 'personalGain',
    trustKey: 'partnerTrust',
    governanceKey: 'pactStrength',
    tokenLabel: '石块',
    governanceLabel: '工时',
    fenceLabel: '轮值',
  },
  palette: { ... }
}
```

3. 在 `ConfigLoader.ts` 中注册配置：

```ts
import { prisonersDilemmaConfig } from '../data/prisonersDilemmaConfig';

const gameConfigs: GameConfig[] = [
  commonsTragedyConfig,
  prisonersDilemmaConfig,
];
```

标题页会自动从 `ConfigLoader.listGames()` 生成故事卡片。核心 UI、状态更新、结局评估和场景控制器不需要重写。

## 美术和音效替换

当前原型用 `Graphics` 绘制占位草场、角色和羊，用 Kenney CC0 UI 图块绘制纸面板、按钮和状态条。

已提交的 UI 素材来源：

- [Kenney UI Pack: RPG Expansion](https://kenney.nl/assets/ui-pack-rpg-expansion)
- License: CC0

后续替换方向：

- 把 `GrasslandController` 的色块改成背景 Sprite 层。
- 把 `SheepController` 的占位羊改成 `Sheep.prefab`。
- 把 `VillagerController` 的占位村民改成不同情绪 Prefab。
- 把 `AudioController` 的 `AudioClip` 属性绑定到 `assets/resources/audio/` 中的真实音效。
- 保留 `visualReaction` 字段，继续由配置驱动动画与表现。

## 说明

第一版优先保证游戏流程、配置驱动、多结局和 Cocos 组件结构。场景、Prefab、音效资源已经预留目录，适合下一步进行美术替换和镜头表现打磨。
