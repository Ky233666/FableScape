# FableScape 互动概念寓言原型

这是一个配置驱动的互动寓言游戏前端框架。第一版内置示例游戏《草场的一天》，用于讲解“公地悲剧”。核心组件不写死具体剧情，后续可以通过新增 `GameConfig` 快速扩展其他概念游戏。

## 技术栈

- Vite 4 + React 18 + TypeScript
- Tailwind CSS
- 纯前端，无后端、登录、数据库
- 移动端优先，适合手机竖屏 H5 体验

## 安装与运行

```bash
npm install
npm run dev
```

默认会启动 Vite 开发服务。浏览器打开终端中显示的本地地址即可体验。

如果 Windows 环境下全局 npm 缓存目录报 `EPERM` 权限错误，可以改用项目内缓存：

```bash
npm install --cache .\.npm-cache
```

构建生产版本：

```bash
npm run build
```

## 项目结构

```text
src/
  App.tsx
  types/game.ts
  data/commonsTragedyConfig.ts
  engine/applyEffects.ts
  engine/getEnding.ts
  components/
    StartScreen.tsx
    GameScreen.tsx
    StatusPanel.tsx
    ChoiceButton.tsx
    FeedbackPanel.tsx
    EndingScreen.tsx
    ProgressIndicator.tsx
  styles/index.css
```

## 如何修改剧情

编辑 `src/data/commonsTragedyConfig.ts`。

常改字段：

- `title`、`subtitle`、`intro`：标题页内容
- `initialState`：初始变量
- `stateLabels`：状态名称、上下限和说明
- `scenes`：每一轮剧情和选择
- `choices.effects`：选择后对状态变量的增减
- `choices.feedback`：选择后的即时反馈
- `endings`：结局条件、结局叙事、概念解释和隐喻映射

每个选择点击后会先显示反馈，用户点击“继续”后才进入下一轮或结局页。

## 如何新增一个概念游戏

1. 在 `src/data/` 下新增一个配置文件，例如 `prisonersDilemmaConfig.ts`。
2. 按 `src/types/game.ts` 中的 `GameConfig` 类型填写内容。
3. 在 `src/App.tsx` 中把 `gameConfig` 指向新的配置。

后续如果需要做游戏列表，只需要增加一个注册表，例如：

```ts
import { commonsTragedyConfig } from './data/commonsTragedyConfig';
import { prisonersDilemmaConfig } from './data/prisonersDilemmaConfig';

export const gameRegistry = {
  commonsTragedy: commonsTragedyConfig,
  prisonersDilemma: prisonersDilemmaConfig,
};
```

核心引擎和组件不需要知道具体概念名称。

## 配置模型

核心类型在 `src/types/game.ts`：

- `GameConfig`：一个完整互动寓言
- `Scene`：一轮剧情
- `Choice`：一个选择及其状态影响
- `Ending`：结局条件和概念解释

当前版本的结局条件使用 TypeScript 函数：

```ts
condition: (state) => state.grassHealth <= 25
```

这样足够直观，也方便第一阶段快速制作不同概念。以后如果要给非技术编辑使用，可以再把条件函数替换成表达式配置或可视化编辑器。
