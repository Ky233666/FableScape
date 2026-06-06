# 寓境 FableScape

「寓境 FableScape」是一个 Cocos Creator 3.8.x 的互动式概念寓言游戏框架。当前内置《草场的一天》《石桥的约定》《回声图书馆》《渡口保单》《雾市买马》《旧辙之路》《分粮的秤》《烽火塔的回声》八个示例，分别用于讲解“公地悲剧”“囚徒困境”“信息茧房”“道德风险”“逆向选择”“路径依赖”“激励相容”和“拜占庭容错”。

这版已经删除 React/Vite 网页原型，改为 Cocos TypeScript 组件架构。第一版场景和角色使用运行时占位图形，UI 面板与按钮接入 Kenney CC0 素材，方便后续替换为 AI 生成图片、Prefab 和音效。

## 技术栈

- Cocos Creator 3.8.x
- TypeScript
- Cocos 内置 UI、场景、Tween、AudioSource
- 配置驱动剧情、状态、选择、反馈和结局
- 首发目标：Web Mobile H5
- 后续可扩展微信小游戏、抖音小游戏

## 当前实现

- 标题页寓言册支持分页，可选择不同故事配置
- 标题页会显示每个寓言的本地游玩次数和已见结局进度
- 结局页会提示“新结局发现 / 已见过 / 全结局达成”，强化重玩探索目标
- 8 个 5 轮示例寓言：公地悲剧、囚徒困境、信息茧房、道德风险、逆向选择、路径依赖、激励相容、拜占庭容错
- 支持 `grassland / bridge / library / harbor / market / road / granary / beacon` 八类运行时占位世界
- 每个故事自定义 4 个状态变量，状态条由配置自动生成
- 每轮会根据当前变量自动生成局势提示，例如“资源承压”“规则薄弱”“治理成形”
- 选择按钮会根据 `tags` 自动显示“短利 / 规则 / 稳健 / 冒险”等策略徽标，并预览主要变量影响
- 选择后状态变化、反馈文本、影响结算芯片、资源标记变化、世界状态变化、角色情绪变化、规则/约束标识变化
- 剧情面板、选择按钮和反馈面板使用轻量 Tween 动画，增强移动端游戏手感
- 多结局：结局由状态变量和选择标签共同判断
- 结局页分为“概念结果 / 隐喻轨迹”页签，揭示概念、解释机制，展示策略画像、故事隐喻和玩家行动轨迹
- 结局页会根据未达成结局自动生成“下一次尝试”目标，提示需要提高、降低或多选择哪类行动
- 通关后可以“回到转折点”，保留前序选择并回到最后一轮前重新决策，便于探索其他结局
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
      ConfigValidator.ts
      StrategyProfileEvaluator.ts
      SituationAdvisor.ts
      ReplayAdvisor.ts
      Motion.ts
      ProgressStore.ts
      EventCenter.ts
      EndingEvaluator.ts
      EffectApplier.ts
      NodeFactory.ts
    data/
      types.ts
      commonsTragedyConfig.ts
      prisonersDilemmaConfig.ts
      informationCocoonConfig.ts
      moralHazardConfig.ts
      adverseSelectionConfig.ts
      pathDependenceConfig.ts
      incentiveCompatibilityConfig.ts
      byzantineFaultToleranceConfig.ts
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

预览后，`FableScapeBootstrap` 会自动创建当前寓言对应的世界场景、角色、资源标记、状态面板、选择按钮、反馈面板和结局页。

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
- `choices.visualReaction.tokenDelta`：选择后资源标记数量变化，草场可代表羊群，石桥可代表石块，渡口可代表货船，马市可代表马匹，旧路可代表车队，粮仓可代表粮秤，烽火线可代表烽火塔，图书馆可代表书页
- `choices.soundCue`：选择后的音效提示
- `endings`：结局条件、解释和最终视觉状态
- `visualTheme.world`：当前视觉世界，例如 `grassland`、`bridge`、`library`、`harbor`、`market`、`road`、`granary` 或 `beacon`
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
  world: 'library',
  stateBindings: {
    resourceKey: 'viewpointDiversity',
    wealthKey: 'feedComfort',
    trustKey: 'viewpointDiversity',
    governanceKey: 'curiosity',
    tokenLabel: '书页',
    tokenSkin: 'page',
    governanceLabel: '书签',
    fenceLabel: '索引',
  },
  palette: { ... }
}
```

3. 在 `ConfigLoader.ts` 中注册配置：

```ts
import { prisonersDilemmaConfig } from '../data/prisonersDilemmaConfig';
import { informationCocoonConfig } from '../data/informationCocoonConfig';
import { moralHazardConfig } from '../data/moralHazardConfig';
import { adverseSelectionConfig } from '../data/adverseSelectionConfig';
import { pathDependenceConfig } from '../data/pathDependenceConfig';
import { incentiveCompatibilityConfig } from '../data/incentiveCompatibilityConfig';
import { byzantineFaultToleranceConfig } from '../data/byzantineFaultToleranceConfig';

const gameConfigs: GameConfig[] = [
  commonsTragedyConfig,
  prisonersDilemmaConfig,
  informationCocoonConfig,
  moralHazardConfig,
  adverseSelectionConfig,
  pathDependenceConfig,
  incentiveCompatibilityConfig,
  byzantineFaultToleranceConfig,
];
```

`visualTheme.world` 目前支持 `grassland`、`bridge`、`library`、`harbor`、`market`、`road`、`granary`、`beacon`。`tokenSkin` 目前支持 `sheep`、`stone`、`page`、`boat`、`horse`、`cart`、`scale`、`beacon`。标题页会自动从 `ConfigLoader.listGames()` 生成分页故事卡片。核心 UI、状态更新、结局评估和场景控制器不需要重写。

`ConfigValidator` 会在运行时检查注册配置。发现重复 `id`、状态变量引用错误、结局条件引用未知变量、缺少兜底结局等问题时，会在 Cocos Console 中输出警告。

## 美术和音效替换

当前原型用 `Graphics` 绘制草场、石桥、图书馆、渡口、雾市、旧路、粮仓、烽火塔八种占位世界，以及角色和资源标记；用 Kenney CC0 UI 图块绘制纸面板、按钮和状态条。

已提交的 UI 素材来源：

- [Kenney UI Pack: RPG Expansion](https://kenney.nl/assets/ui-pack-rpg-expansion)
- License: CC0

后续替换方向：

- 把 `GrasslandController` 中的通用世界绘制改成背景 Sprite 层或世界 Prefab。
- 把 `SheepController` 的资源标记替换为羊、石块、书页等主题 Prefab。
- 把 `VillagerController` 的占位村民改成不同情绪 Prefab。
- 把 `AudioController` 的 `AudioClip` 属性绑定到 `assets/resources/audio/` 中的真实音效。
- 保留 `visualReaction` 字段，继续由配置驱动动画与表现。

## 说明

第一版优先保证游戏流程、配置驱动、多结局和 Cocos 组件结构。场景、Prefab、音效资源已经预留目录，适合下一步进行美术替换和镜头表现打磨。
