import pastureCrest from '../assets/pasture-crest.svg';
import type { GameConfig } from '../types/game';

export const commonsTragedyConfig: GameConfig = {
  id: 'commons-tragedy-pasture-day',
  title: '草场的一天',
  subtitle: '在公共草场上，体验个体理性如何推着系统走向失衡。',
  conceptName: '公地悲剧',
  conceptShortExplanation:
    '当资源属于所有人共同使用，而额外收益归个人、损耗成本由群体分担时，理性的个体选择可能造成集体性的资源枯竭。',
  playerRole: '公共草场上的一名牧羊人',
  intro:
    '清晨，村里的钟声响起。草场属于每一个村民，也不真正属于任何一个人。你今天要决定放多少羊、要不要守约，以及是否推动大家立下规则。',
  coverImage: pastureCrest,
  initialState: {
    personalWealth: 42,
    grassHealth: 78,
    villageTrust: 58,
    ruleSupport: 25,
  },
  stateLabels: {
    personalWealth: {
      label: '个人财富',
      description: '你的短期收益与可支配资源。',
      min: 0,
      max: 100,
      lowText: '拮据',
      highText: '丰厚',
    },
    grassHealth: {
      label: '草场健康',
      description: '公共草场承受放牧压力后的恢复能力。',
      min: 0,
      max: 100,
      lowText: '枯竭',
      highText: '丰茂',
    },
    villageTrust: {
      label: '村庄信任',
      description: '村民相信彼此会守约的程度。',
      min: 0,
      max: 100,
      lowText: '猜疑',
      highText: '互信',
    },
    ruleSupport: {
      label: '规则支持',
      description: '村民愿意接受共同约束的程度。',
      min: 0,
      max: 100,
      lowText: '松散',
      highText: '成形',
    },
  },
  scenes: [
    {
      id: 'morning-gate',
      title: '清晨的木门',
      narrative:
        '你牵着羊来到草场入口。村里约定每家今天只放三只羊。草叶还带着露水，旁边的牧羊人都在看着彼此的羊群。',
      choices: [
        {
          id: 'keep-three',
          text: '遵守约定，只放三只羊',
          description: '收益平稳，草场压力较小，也给邻居一个明确的信号。',
          effects: {
            personalWealth: 8,
            grassHealth: -5,
            villageTrust: 8,
            ruleSupport: 3,
          },
          feedback:
            '你把多余的羊留在栏里。今天的收入不算最高，但几个邻居点了点头，草场也没有立刻显出压力。',
          tags: ['cooperate'],
        },
        {
          id: 'sneak-one',
          text: '偷偷多放一只羊',
          description: '额外收益归你自己，草场损耗会被所有人一起承担。',
          effects: {
            personalWealth: 16,
            grassHealth: -14,
            villageTrust: -8,
            ruleSupport: -2,
          },
          feedback:
            '第四只羊很快吃到一片嫩草。你的钱袋重了一些，但有人注意到了脚印，草场边缘也多出一块稀疏的斑。',
          tags: ['defect', 'short-term'],
        },
        {
          id: 'propose-counting',
          text: '提议大家公开数羊',
          description: '短期麻烦一点，但能让约定变得可见。',
          effects: {
            personalWealth: 5,
            grassHealth: -4,
            villageTrust: 6,
            ruleSupport: 14,
          },
          feedback:
            '你花时间把大家聚到门口。有人嫌麻烦，也有人松了口气：至少今天的约定不再只靠猜。',
          tags: ['institution'],
        },
      ],
    },
    {
      id: 'noon-whispers',
      title: '午后的低语',
      narrative:
        '太阳升高后，你听见两户人家悄悄把羊赶进远处的坡地。草场是大家的，没人立刻出来阻止。',
      choices: [
        {
          id: 'hold-line',
          text: '继续守住自己的羊群',
          description: '不跟风扩张，保住互信，但会承受比较明显的收益差距。',
          effects: {
            personalWealth: 6,
            grassHealth: -6,
            villageTrust: 7,
            ruleSupport: 4,
          },
          feedback:
            '你的羊群没有增加。你看着别人多赚了一些，心里并不轻松，但几位守约者开始靠近你商量办法。',
          tags: ['cooperate'],
        },
        {
          id: 'follow-expansion',
          text: '跟着别人一起扩张羊群',
          description: '既然别人已经多放，你也不想吃亏。',
          effects: {
            personalWealth: 18,
            grassHealth: -22,
            villageTrust: -14,
            ruleSupport: -5,
          },
          feedback:
            '你也把羊赶上坡。今天看起来很划算，但坡地很快露出黄土，村民之间开始互相盯着彼此。',
          tags: ['defect', 'short-term', 'herd'],
        },
        {
          id: 'call-meeting',
          text: '召集守约者开小会',
          description: '牺牲一点放牧时间，推动大家讨论共同规则。',
          effects: {
            personalWealth: 4,
            grassHealth: -5,
            villageTrust: 5,
            ruleSupport: 18,
          },
          feedback:
            '你们坐在老橡树下清点损耗。有人第一次承认：只靠“大家自觉”很难挡住眼前的诱惑。',
          tags: ['institution'],
        },
      ],
    },
    {
      id: 'dry-bank',
      title: '干裂的溪岸',
      narrative:
        '下午，溪岸边的草被啃得发白。村长问大家是否需要更明确的约束，但也有人说规则会限制各家的生计。',
      choices: [
        {
          id: 'argue-morality',
          text: '只呼吁大家讲良心',
          description: '不用建立硬规则，主要依赖个人自觉。',
          effects: {
            personalWealth: 7,
            grassHealth: -11,
            villageTrust: 2,
            ruleSupport: 1,
          },
          feedback:
            '你的话说得体面，却很难改变激励。大家口头赞成，转身仍在计算自己能不能多赶一只羊。',
          tags: ['morality'],
        },
        {
          id: 'support-quota',
          text: '支持限额和轮牧',
          description: '让每家有明确上限，并给草场恢复时间。',
          effects: {
            personalWealth: 5,
            grassHealth: 8,
            villageTrust: 6,
            ruleSupport: 22,
          },
          feedback:
            '限额让几户人家皱起眉头，但轮牧图摆出来后，大家看见草场并不是取之不尽。',
          tags: ['institution', 'quota'],
        },
        {
          id: 'buy-more-sheep',
          text: '趁规则前再多买两只羊',
          description: '抢在规则落地前扩大收益，风险转给未来。',
          effects: {
            personalWealth: 21,
            grassHealth: -25,
            villageTrust: -18,
            ruleSupport: -8,
          },
          feedback:
            '你的羊群更大了，账本也更好看。但草场上突然拥挤起来，其他人也开始怀疑规则还有没有意义。',
          tags: ['defect', 'short-term'],
        },
      ],
    },
    {
      id: 'evening-rule',
      title: '傍晚的木牌',
      narrative:
        '村口立起一块空白木牌。上面可以写下共同规则，也可能什么都不写。争论已经持续了一个下午。',
      choices: [
        {
          id: 'punishment-system',
          text: '推动惩罚机制',
          description: '违规会被记录并补偿草场损失，短期会得罪一些人。',
          effects: {
            personalWealth: 3,
            grassHealth: 7,
            villageTrust: -3,
            ruleSupport: 24,
          },
          feedback:
            '木牌上写下了违规成本。几个人脸色难看，但更多人明白：没有代价的约定等于没有约定。',
          tags: ['institution', 'enforcement'],
        },
        {
          id: 'private-deal',
          text: '和邻居私下交换放牧名额',
          description: '你能保住收益，但公共规则会变得模糊。',
          effects: {
            personalWealth: 15,
            grassHealth: -12,
            villageTrust: -10,
            ruleSupport: -6,
          },
          feedback:
            '这笔交换对你们两家都有利，却让旁人觉得规则只是给老实人看的。草场继续承压。',
          tags: ['defect', 'short-term'],
        },
        {
          id: 'rest-pasture',
          text: '主动让一片草地休养',
          description: '今天少赚一点，帮助公共资源恢复。',
          effects: {
            personalWealth: 4,
            grassHealth: 15,
            villageTrust: 8,
            ruleSupport: 9,
          },
          feedback:
            '你把羊群赶离溪岸。恢复不会立刻发生，但这个动作让人们第一次认真讨论明天还能不能继续放牧。',
          tags: ['cooperate'],
        },
      ],
    },
    {
      id: 'night-count',
      title: '夜里的清点',
      narrative:
        '夜色落下，村民开始清点羊、钱袋和被啃过的草场。今天的选择已经留下痕迹，明天会从这些痕迹上开始。',
      choices: [
        {
          id: 'admit-cost',
          text: '公开承认公共损耗',
          description: '把草场的损耗说清楚，让收益和成本重新被看见。',
          effects: {
            personalWealth: 2,
            grassHealth: 4,
            villageTrust: 10,
            ruleSupport: 16,
          },
          feedback:
            '你把今天多赚和草场损耗放在同一张账上。沉默之后，许多人意识到“我的收益”和“我们的成本”从未分开。',
          tags: ['institution', 'reflection'],
        },
        {
          id: 'keep-profit',
          text: '只带走今天多赚的钱',
          description: '先把个人收益落袋，明天的问题明天再说。',
          effects: {
            personalWealth: 16,
            grassHealth: -16,
            villageTrust: -12,
            ruleSupport: -4,
          },
          feedback:
            '你没有多说什么。钱袋确实更沉，但回头看去，草场像被夜色提前抽空了一块。',
          tags: ['defect', 'short-term'],
        },
        {
          id: 'sign-charter',
          text: '签下共同治理公约',
          description: '把限额、巡查、休养和补偿写成明天要执行的规则。',
          effects: {
            personalWealth: 3,
            grassHealth: 10,
            villageTrust: 7,
            ruleSupport: 26,
          },
          feedback:
            '木牌终于不再空着。公约没有让所有人满意，却把公共草场从“没人负责”变成了“共同负责”。',
          tags: ['institution', 'governance'],
        },
      ],
    },
  ],
  endings: [
    {
      id: 'collapse',
      title: '草场崩溃',
      condition: (state) => state.grassHealth <= 25,
      narrative:
        '第二天清晨，羊群站在大片裸露的黄土前。昨天每个人都觉得自己只是多拿了一点，合在一起却把草场推过了承受线。',
      conceptReveal: '这就是公地悲剧。',
      explanation:
        '公共资源被共同使用时，如果个人多使用资源的收益归自己，而资源退化的成本由所有人分摊，系统会鼓励每个人继续多拿一点。结果不是某个人特别坏，而是激励结构把集体推向损失。',
      metaphorMapping: [
        { storyElement: '被过度啃食的草场', realWorldMeaning: '渔场、空气、道路、公共注意力等共享资源' },
        { storyElement: '多放的一只羊', realWorldMeaning: '个人额外占用公共资源带来的短期收益' },
        { storyElement: '裸露的黄土', realWorldMeaning: '公共资源退化后由所有人承担的长期成本' },
      ],
    },
    {
      id: 'short-profit',
      title: '钱袋更重，明天更窄',
      condition: (state) =>
        state.personalWealth >= 72 &&
        state.grassHealth < 55 &&
        state.villageTrust < 45,
      narrative:
        '你今天赚得不少，甚至比多数邻居都多。但夜里回家时，你发现大家不再相信彼此，明天的草也明显少了。',
      conceptReveal: '你经历了公地悲剧的短期理性版本。',
      explanation:
        '从单次选择看，多放羊很合理：收益明确、成本分散。但当每个人都这样计算，草场和信任同时下降。个体短期理性没有自动导向系统长期稳定。',
      metaphorMapping: [
        { storyElement: '更重的钱袋', realWorldMeaning: '个人短期收益最大化' },
        { storyElement: '下降的村庄信任', realWorldMeaning: '重复博弈中互信被破坏' },
        { storyElement: '变窄的明天', realWorldMeaning: '未来选择空间被今天的过度使用压缩' },
      ],
    },
    {
      id: 'governance',
      title: '木牌上的新规则',
      condition: (state) => state.grassHealth >= 50 && state.ruleSupport >= 65,
      narrative:
        '第二天，草场没有完全恢复，但村口的木牌让所有人知道边界在哪里。限额、轮牧和补偿机制开始改变每个人的计算方式。',
      conceptReveal: '公地悲剧需要治理机制来破解。',
      explanation:
        '公共资源问题不能只靠个人道德。更可靠的做法是改变激励：明确边界、监督使用、惩罚违规、补偿损耗，并让资源有恢复时间。',
      metaphorMapping: [
        { storyElement: '限额和轮牧', realWorldMeaning: '使用权边界与资源恢复机制' },
        { storyElement: '惩罚机制', realWorldMeaning: '让违规者承担外部成本' },
        { storyElement: '共同治理公约', realWorldMeaning: '通过制度把个体选择重新嵌入集体后果' },
      ],
    },
    {
      id: 'fragile-balance',
      title: '脆弱的平衡',
      condition: () => true,
      narrative:
        '草场还没有崩溃，但村庄也没有真正解决问题。今天的克制保住了一些余地，明天仍需要更清楚的规则。',
      conceptReveal: '你看到了公地悲剧的临界状态。',
      explanation:
        '当公共资源还没耗尽时，人们容易误以为系统没有问题。真正的难点在于：要在崩溃前就建立能约束行为、分担成本、保护恢复能力的机制。',
      metaphorMapping: [
        { storyElement: '尚未枯竭的草场', realWorldMeaning: '还没被耗尽但正在承压的公共资源' },
        { storyElement: '犹豫的村民', realWorldMeaning: '面对长期风险时行动不足的群体' },
        { storyElement: '空白木牌', realWorldMeaning: '尚未形成的治理规则' },
      ],
    },
  ],
  metaphorExplanation: [
    { storyElement: '公共草场', realWorldMeaning: '任何多人共享、难以排他的资源' },
    { storyElement: '牧羊人', realWorldMeaning: '在系统中追求自身收益的个体或组织' },
    { storyElement: '羊群数量', realWorldMeaning: '对公共资源的使用强度' },
    { storyElement: '村庄信任', realWorldMeaning: '合作得以持续的社会资本' },
    { storyElement: '村规与惩罚', realWorldMeaning: '让外部成本回到行动者身上的治理机制' },
  ],
};
