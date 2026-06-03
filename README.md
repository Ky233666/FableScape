# 寓境 FableScape

「寓境 FableScape」是一个 Cocos Creator 3.8.x 的互动式概念寓言游戏框架。当前第一版示例是《草场的一天》，用于讲解“公地悲剧”。

这版已经删除 React/Vite 网页原型，改为 Cocos TypeScript 组件架构。第一版资源使用运行时占位图形，方便后续替换为 AI 生成图片、Prefab 和音效。

## 技术栈

- Cocos Creator 3.8.x
- TypeScript
- Cocos 内置 UI、场景、Tween、AudioSource
- 配置驱动剧情、状态、选择、反馈和结局
- 首发目标：Web Mobile H5
- 后续可扩展微信小游戏、抖音小游戏

## 当前实现

- 5 轮《草场的一天》玩法
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
    audio/
    configs/
settings/
  project.json
```

## 如何在 Cocos Creator 中运行

由于 Cocos 的 `.scene` 和 `.prefab` 文件包含编辑器生成的 UUID 与序列化引用，这一版不手写不稳定的场景文件，而是提供运行时 Bootstrap。

操作步骤：

1. 用 Cocos Creator 3.8.x 打开本项目目录。
2. 在 `assets/scenes/` 下创建一个新场景，命名为 `Start.scene`。
3. 场景中创建一个 `Canvas` 节点。
4. 选中 `Canvas`，添加组件 `FableScapeBootstrap`。
5. 保存场景。
6. 点击 Preview。

预览后，`FableScapeBootstrap` 会自动创建草场、牧羊人、羊群、村民、状态面板、选择按钮、反馈面板和结局页。

## 如何发布 Web Mobile H5

1. Cocos Creator 顶部菜单打开 Build。
2. Platform 选择 `Web Mobile`。
3. Start Scene 选择 `Start.scene`。
4. 构建并运行。

建议设计分辨率保持：

- Width: `720`
- Height: `1280`
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

3. 在 `ConfigLoader.ts` 中切换默认配置：

```ts
import { prisonersDilemmaConfig } from '../data/prisonersDilemmaConfig';

export class ConfigLoader {
  static loadDefaultGame() {
    return prisonersDilemmaConfig;
  }
}
```

核心 UI、状态更新、结局评估和场景控制器不需要重写。

## 美术和音效替换

当前原型用 `Graphics` 绘制占位草场、角色、羊和 UI。

后续替换方向：

- 把 `GrasslandController` 的色块改成背景 Sprite 层。
- 把 `SheepController` 的占位羊改成 `Sheep.prefab`。
- 把 `VillagerController` 的占位村民改成不同情绪 Prefab。
- 把 `AudioController` 的 `AudioClip` 属性绑定到 `assets/resources/audio/` 中的真实音效。
- 保留 `visualReaction` 字段，继续由配置驱动动画与表现。

## 说明

第一版优先保证游戏流程、配置驱动、多结局和 Cocos 组件结构。场景、Prefab、音效资源已经预留目录，适合下一步进行美术替换和镜头表现打磨。
