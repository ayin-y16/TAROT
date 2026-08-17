const cupsCards = [
  {
    id: "cups-01",
    order: 37,
    name: "圣杯王牌",
    gemstoneName: "芙蓉石0930",
    category: "cups",
    image: "./assets/cards/cups-01.jpg",
    upright: {
      shortText: "还想和你谈论宇宙和天空",
      keywords: ["爱", "新感情", "直觉", "创造力"],
      fullInterpretation: `
        <h4>核心讯息</h4>
        <p>圣杯王牌正位是爱、直觉与新情感的开端，心被温柔填满。</p>
        <h4>关系与情感</h4>
        <p>关系迎来纯粹的心动或深层连接，值得敞开心。</p>
        <h4>工作与现实</h4>
        <p>创造力与情感丰沛，适合开启有感而发的事。</p>
        <h4>给你的建议</h4>
        <p>允许自己被触动，把这份柔软化为行动。</p>
      `,
    },
    reversed: {
      shortText: "短暂又遗憾的相遇是在惩罚认真且守旧的人。",
      keywords: ["情感障碍", "创造力受阻"],
      fullInterpretation: `
        <h4>核心讯息</h4>
        <p>逆位提示情感阻塞或创造力受阻，心门暂闭。</p>
        <h4>关系与情感</h4>
        <p>关系可能因害怕受伤而疏远，需慢慢破冰。</p>
        <h4>工作与现实</h4>
        <p>当心情绪卡顿影响表达，先与自己和解。</p>
        <h4>给你的建议</h4>
        <p>别把防御当成坚强，给感受一点流淌的空间。</p>
      `,
    },
  },
  {
    id: "cups-02",
    order: 38,
    name: "圣杯二",
    gemstoneName: "拉利玛 38",
    category: "cups",
    image: "./assets/cards/cups-02.jpg",
    upright: {
      shortText: "圣杯二正位一句话格言",
      keywords: ["连接", "吸引", "伙伴关系"],
      fullInterpretation: `
        <h4>核心讯息</h4>
        <p>圣杯二正位象征连接、吸引与平等的伙伴关系。</p>
        <h4>关系与情感</h4>
        <p>关系是两情相悦、势均力敌的美好开端。</p>
        <h4>工作与现实</h4>
        <p>适合建立合作、结盟与互利共赢。</p>
        <h4>给你的建议</h4>
        <p>在平等与真诚中靠近，好的关系彼此成就。</p>
      `,
    },
    reversed: {
      shortText: "圣杯二逆位一句话格言",
      keywords: ["不平衡", "误解", "分离"],
      fullInterpretation: `
        <h4>核心讯息</h4>
        <p>逆位提示失衡、误解或连接的松动。</p>
        <h4>关系与情感</h4>
        <p>关系可能出现不对等或沟通错位。</p>
        <h4>工作与现实</h4>
        <p>当心合作里的期待落差，先对齐再继续。</p>
        <h4>给你的建议</h4>
        <p>把未说清的期待说清，别让误会发酵。</p>
      `,
    },
  },
  {
    id: "cups-03",
    order: 39,
    name: "圣杯三",
    gemstoneName: "蓝晶石 39",
    category: "cups",
    image: "./assets/cards/cups-03.jpg",
    upright: {
      shortText: "圣杯三正位一句话格言",
      keywords: ["庆祝", "友谊", "社区", "欢乐"],
      fullInterpretation: `
        <h4>核心讯息</h4>
        <p>圣杯三正位代表庆祝、友谊与社群的欢聚。</p>
        <h4>关系与情感</h4>
        <p>关系是轻松欢乐的，友谊与圈子的支持很珍贵。</p>
        <h4>工作与现实</h4>
        <p>适合团队庆祝、社交拓展与协作氛围。</p>
        <h4>给你的建议</h4>
        <p>享受当下的相聚，好人缘是你隐形的资产。</p>
      `,
    },
    reversed: {
      shortText: "圣杯三逆位一句话格言",
      keywords: ["过度放纵", "八卦", "孤立"],
      fullInterpretation: `
        <h4>核心讯息</h4>
        <p>逆位提示过度放纵、八卦或一时的孤立。</p>
        <h4>关系与情感</h4>
        <p>关系里可能因小事生隙或热闹后的落寞。</p>
        <h4>工作与现实</h4>
        <p>当心社交消耗，筛选真正滋养你的圈子。</p>
        <h4>给你的建议</h4>
        <p>欢聚之余留点独处，别用喧闹掩饰空虚。</p>
      `,
    },
  },
  {
    id: "cups-04",
    order: 40,
    name: "圣杯四",
    gemstoneName: "蓝宝石 40",
    category: "cups",
    image: "./assets/cards/cups-04.jpg",
    upright: {
      shortText: "圣杯四正位一句话格言",
      keywords: ["沉思", "冷漠", "不满足"],
      fullInterpretation: `
        <h4>核心讯息</h4>
        <p>圣杯四正位象征沉思、冷淡与对现状的不满足。</p>
        <h4>关系与情感</h4>
        <p>关系进入平淡期，你有些疏离与倦怠。</p>
        <h4>工作与现实</h4>
        <p>适合暂停、内省，重新审视自己真正想要。</p>
        <h4>给你的建议</h4>
        <p>不满足是信号，别急着外求，先看清内心。</p>
      `,
    },
    reversed: {
      shortText: "圣杯四逆位一句话格言",
      keywords: ["觉醒", "新机会", "行动"],
      fullInterpretation: `
        <h4>核心讯息</h4>
        <p>逆位提示觉醒、新机会出现或重新行动。</p>
        <h4>关系与情感</h4>
        <p>关系从冷淡中回温，愿意再给一次机会。</p>
        <h4>工作与现实</h4>
        <p>当心错失伸来的橄榄枝，睁开眼看看。</p>
        <h4>给你的建议</h4>
        <p>新的可能就在手边，别困在自己的闷里。</p>
      `,
    },
  },
  {
    id: "cups-05",
    order: 41,
    name: "圣杯五",
    gemstoneName: "堇青石 41",
    category: "cups",
    image: "./assets/cards/cups-05.jpg",
    upright: {
      shortText: "圣杯五正位一句话格言",
      keywords: ["悲伤", "失落", "遗憾", "关注负面"],
      fullInterpretation: `
        <h4>核心讯息</h4>
        <p>圣杯五正位照见悲伤、失落与聚焦于缺憾的目光。</p>
        <h4>关系与情感</h4>
        <p>关系里有未愈的伤口，你盯着失去的而忽略仍在的。</p>
        <h4>工作与现实</h4>
        <p>情绪低谷影响判断，先允许自己哀悼。</p>
        <h4>给你的建议</h4>
        <p>为失去难过没错，但别忘了身后还站着的人。</p>
      `,
    },
    reversed: {
      shortText: "圣杯五逆位一句话格言",
      keywords: ["接受", "宽恕", "向前看"],
      fullInterpretation: `
        <h4>核心讯息</h4>
        <p>逆位提示接受、宽恕与向前看，伤口开始结痂。</p>
        <h4>关系与情感</h4>
        <p>关系走向和解，愿意放下旧怨。</p>
        <h4>工作与现实</h4>
        <p>适合翻篇与重建，把注意力移向未来。</p>
        <h4>给你的建议</h4>
        <p>你已经哭够了，抬起头，剩下的路还长。</p>
      `,
    },
  },
  {
    id: "cups-06",
    order: 42,
    name: "圣杯六",
    gemstoneName: "托帕石 42",
    category: "cups",
    image: "./assets/cards/cups-06.jpg",
    upright: {
      shortText: "圣杯六正位一句话格言",
      keywords: ["怀旧", "童年记忆", "纯真"],
      fullInterpretation: `
        <h4>核心讯息</h4>
        <p>圣杯六正位象征怀旧、纯真与来自过去的温暖。</p>
        <h4>关系与情感</h4>
        <p>关系带着熟悉与安全感的甜，可能重逢旧人。</p>
        <h4>工作与现实</h4>
        <p>适合回归本心、延续稳妥的模式与老客户。</p>
        <h4>给你的建议</h4>
        <p>怀念美好可以，但别用过去困住现在。</p>
      `,
    },
    reversed: {
      shortText: "圣杯六逆位一句话格言",
      keywords: ["执着过去", "不成熟"],
      fullInterpretation: `
        <h4>核心讯息</h4>
        <p>逆位提示执着过去或不成熟，沉溺回忆。</p>
        <h4>关系与情感</h4>
        <p>关系可能因不愿成长而停滞，需往前。</p>
        <h4>工作与现实</h4>
        <p>当心被旧模式拖累，适度打破舒适圈。</p>
        <h4>给你的建议</h4>
        <p>回忆是礼物不是牢笼，带着它继续走。</p>
      `,
    },
  },
  {
    id: "cups-07",
    order: 43,
    name: "圣杯七",
    gemstoneName: "绿柱石 43",
    category: "cups",
    image: "./assets/cards/cups-07.jpg",
    upright: {
      shortText: "圣杯七正位一句话格言",
      keywords: ["幻想", "选择", "一厢情愿"],
      fullInterpretation: `
        <h4>核心讯息</h4>
        <p>圣杯七正位象征幻想、选择与一厢情愿的迷雾。</p>
        <h4>关系与情感</h4>
        <p>关系里充满想象与不确定，需分辨真实与投射。</p>
        <h4>工作与现实</h4>
        <p>面对多个可能别急着选，先看清每个的代价。</p>
        <h4>给你的建议</h4>
        <p>把飘在空中的愿望落地检验，别被幻象迷惑。</p>
      `,
    },
    reversed: {
      shortText: "圣杯七逆位一句话格言",
      keywords: ["清晰", "现实检查", "决策"],
      fullInterpretation: `
        <h4>核心讯息</h4>
        <p>逆位提示清晰、落地与现实检验，迷雾散去。</p>
        <h4>关系与情感</h4>
        <p>关系走向务实，愿意直面真实而非幻想。</p>
        <h4>工作与现实</h4>
        <p>适合做清醒决策，把资源投向靠谱的方向。</p>
        <h4>给你的建议</h4>
        <p>幻想退场后，真正的机会才看得清。</p>
      `,
    },
  },
  {
    id: "cups-08",
    order: 44,
    name: "圣杯八",
    gemstoneName: "月长石 44",
    category: "cups",
    image: "./assets/cards/cups-08.jpg",
    upright: {
      shortText: "圣杯八正位一句话格言",
      keywords: ["离去", "追寻", "放弃舒适"],
      fullInterpretation: `
        <h4>核心讯息</h4>
        <p>圣杯八正位代表离去、追寻与主动放弃舒适。</p>
        <h4>关系与情感</h4>
        <p>关系里你选择出走，去寻找更契合的归属。</p>
        <h4>工作与现实</h4>
        <p>适合离开不再成长的环境，踏上内心的 quest。</p>
        <h4>给你的建议</h4>
        <p>离开需要勇气，但停留在错的地方更耗人。</p>
      `,
    },
    reversed: {
      shortText: "圣杯八逆位一句话格言",
      keywords: ["恐惧改变", "犹豫不决"],
      fullInterpretation: `
        <h4>核心讯息</h4>
        <p>逆位提示恐惧改变或犹豫不决，困在原地。</p>
        <h4>关系与情感</h4>
        <p>关系因不敢变动而僵持，需正视去留。</p>
        <h4>工作与现实</h4>
        <p>当心错过转型窗口，拖延只会更痛。</p>
        <h4>给你的建议</h4>
        <p>你早知道答案，只是怕疼，给自己一个决断。</p>
      `,
    },
  },
  {
    id: "cups-09",
    order: 45,
    name: "圣杯九",
    gemstoneName: "蓝磷灰石 45",
    category: "cups",
    image: "./assets/cards/cups-09.jpg",
    upright: {
      shortText: "圣杯九正位一句话格言",
      keywords: ["满足", "愿望成真", "舒适"],
      fullInterpretation: `
        <h4>核心讯息</h4>
        <p>圣杯九正位象征满足、愿望成真与情感上的丰足。</p>
        <h4>关系与情感</h4>
        <p>关系是被滋养与满意的，独处也自在。</p>
        <h4>工作与现实</h4>
        <p>适合享受成果、犒赏自己与稳固口碑。</p>
        <h4>给你的建议</h4>
        <p>你值得这份圆满，安心收下并分享喜悦。</p>
      `,
    },
    reversed: {
      shortText: "圣杯九逆位一句话格言",
      keywords: ["过度自满", "贪婪", "物质主义"],
      fullInterpretation: `
        <h4>核心讯息</h4>
        <p>逆位提示自满、贪婪或物质化的空虚。</p>
        <h4>关系与情感</h4>
        <p>关系可能因表面满足而疏于经营。</p>
        <h4>工作与现实</h4>
        <p>当心被欲望填满却内心空荡，回归本质。</p>
        <h4>给你的建议</h4>
        <p>满足不是终点，别让舒适圈变成牢笼。</p>
      `,
    },
  },
  {
    id: "cups-10",
    order: 46,
    name: "圣杯十",
    gemstoneName: "天青石 46",
    category: "cups",
    image: "./assets/cards/cups-10.jpg",
    upright: {
      shortText: "圣杯十正位一句话格言",
      keywords: ["幸福", "和谐", "家庭", "情感满足"],
      fullInterpretation: `
        <h4>核心讯息</h4>
        <p>圣杯十正位代表幸福、和睦与家庭的情感圆满。</p>
        <h4>关系与情感</h4>
        <p>关系是归处与长久的安稳，被爱包围。</p>
        <h4>工作与现实</h4>
        <p>适合经营家庭、团队归属与长期幸福感。</p>
        <h4>给你的建议</h4>
        <p>珍惜眼前人的陪伴，平凡的稳定最珍贵。</p>
      `,
    },
    reversed: {
      shortText: "圣杯十逆位一句话格言",
      keywords: ["家庭冲突", "不和谐"],
      fullInterpretation: `
        <h4>核心讯息</h4>
        <p>逆位提示家庭冲突或不和谐，圆满出现裂痕。</p>
        <h4>关系与情感</h4>
        <p>关系里可能因期待落差而失落，需沟通。</p>
        <h4>工作与现实</h4>
        <p>当心表面的和睦掩盖真实矛盾，尽早疏解。</p>
        <h4>给你的建议</h4>
        <p>别用应该幸福压抑不满，坦诚才有修复。</p>
      `,
    },
  },
  {
    id: "cups-11",
    order: 47,
    name: "圣杯侍从",
    gemstoneName: "海纹石 47",
    category: "cups",
    image: "./assets/cards/cups-11.jpg",
    upright: {
      shortText: "圣杯侍从正位一句话格言",
      keywords: ["创意灵感", "情感消息", "直觉"],
      fullInterpretation: `
        <h4>核心讯息</h4>
        <p>圣杯侍从正位象征创意灵感、情感消息与温柔的好奇。</p>
        <h4>关系与情感</h4>
        <p>关系里带着纯真与体贴靠近，消息令人心动。</p>
        <h4>工作与现实</h4>
        <p>适合开启感性项目、学习与表达心意。</p>
        <h4>给你的建议</h4>
        <p>让灵感自然流淌，用真诚打动人。</p>
      `,
    },
    reversed: {
      shortText: "圣杯侍从逆位一句话格言",
      keywords: ["情感不成熟", "灵感受阻"],
      fullInterpretation: `
        <h4>核心讯息</h4>
        <p>逆位提示情感不成熟或灵感受阻，表达卡壳。</p>
        <h4>关系与情感</h4>
        <p>关系可能因幼稚或回避而失温。</p>
        <h4>工作与现实</h4>
        <p>当心情绪化影响发挥，先稳住内心。</p>
        <h4>给你的建议</h4>
        <p>把敏感变成敏锐，别让害羞堵住心声。</p>
      `,
    },
  },
  {
    id: "cups-12",
    order: 48,
    name: "圣杯骑士",
    gemstoneName: "坦桑石 48",
    category: "cups",
    image: "./assets/cards/cups-12.jpg",
    upright: {
      shortText: "圣杯骑士正位一句话格言",
      keywords: ["浪漫", "魅力", "创意追求"],
      fullInterpretation: `
        <h4>核心讯息</h4>
        <p>圣杯骑士正位代表浪漫、魅力与为爱奔赴的温柔行动。</p>
        <h4>关系与情感</h4>
        <p>关系是被浪漫与诚意打动，适合表白与靠近。</p>
        <h4>工作与现实</h4>
        <p>适合以创意与情感驱动的项目、艺术表达。</p>
        <h4>给你的建议</h4>
        <p>带着真心去追，但别只活在自己的剧本里。</p>
      `,
    },
    reversed: {
      shortText: "圣杯骑士逆位一句话格言",
      keywords: ["情绪化", "失望", "受骗"],
      fullInterpretation: `
        <h4>核心讯息</h4>
        <p>逆位提示情绪化、失望或被表象欺骗。</p>
        <h4>关系与情感</h4>
        <p>关系可能因不切实际而受伤，需清醒。</p>
        <h4>工作与现实</h4>
        <p>当心被情怀冲昏头，落实比许诺重要。</p>
        <h4>给你的建议</h4>
        <p>浪漫值得，但别用幻想代替了解。</p>
      `,
    },
  },
  {
    id: "cups-13",
    order: 49,
    name: "圣杯皇后",
    gemstoneName: "葡萄石 49",
    category: "cups",
    image: "./assets/cards/cups-13.jpg",
    upright: {
      shortText: "圣杯皇后正位一句话格言",
      keywords: ["同理心", "直觉", "情感支持", "温柔"],
      fullInterpretation: `
        <h4>核心讯息</h4>
        <p>圣杯王后正位象征同理心、直觉与丰沛的情感支持。</p>
        <h4>关系与情感</h4>
        <p>关系是温柔包容的港湾，你以共情滋养彼此。</p>
        <h4>工作与现实</h4>
        <p>适合以关怀、咨询与创意服务他人。</p>
        <h4>给你的建议</h4>
        <p>信任你的感受力，温柔也是一种力量。</p>
      `,
    },
    reversed: {
      shortText: "圣杯皇后逆位一句话格言",
      keywords: ["情绪不稳", "过度依赖", "边界模糊", "情绪化"],
      fullInterpretation: `
        <h4>核心讯息</h4>
        <p>逆位提示情绪不稳或过度依赖，边界模糊。</p>
        <h4>关系与情感</h4>
        <p>关系里可能因情绪化而消耗，需自持。</p>
        <h4>工作与现实</h4>
        <p>当心被情绪拖累判断，先安顿自己。</p>
        <h4>给你的建议</h4>
        <p>共情之余留一点给自己，别把别人的情绪全背身上。</p>
      `,
    },
  },
  {
    id: "cups-14",
    order: 50,
    name: "圣杯国王",
    gemstoneName: "祖母绿 50",
    category: "cups",
    image: "./assets/cards/cups-14.jpg",
    upright: {
      shortText: "圣杯国王正位一句话格言",
      keywords: ["情感平衡", "慈悲", "智慧"],
      fullInterpretation: `
        <h4>核心讯息</h4>
        <p>圣杯国王正位代表情感平衡、慈悲与沉稳的智慧。</p>
        <h4>关系与情感</h4>
        <p>关系是成熟而包容的引领，给人安全感。</p>
        <h4>工作与现实</h4>
        <p>适合以情商领导、调解与稳健决策。</p>
        <h4>给你的建议</h4>
        <p>用理解与分寸待人，情绪稳定是你最大的底气。</p>
      `,
    },
    reversed: {
      shortText: "圣杯国王逆位一句话格言",
      keywords: ["情感压抑", "冷漠", "操纵"],
      fullInterpretation: `
        <h4>核心讯息</h4>
        <p>逆位提示情感压抑、冷漠或操纵，平衡失守。</p>
        <h4>关系与情感</h4>
        <p>关系里可能用情绪控制对方，需自省。</p>
        <h4>工作与现实</h4>
        <p>当心被冷处理或算计，守住边界。</p>
        <h4>给你的建议</h4>
        <p>真正的成熟是坦诚，而非把感受藏成利器。</p>
      `,
    },
  }
];
