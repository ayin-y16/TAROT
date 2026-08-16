'use strict';

const SITE_CONFIG = {
  title: '宝石塔罗',

  // 改成你的背景图片路径
  backgroundImage: './assets/background.png',
  backgroundMusic: './assets/background-music.mp3',
  // 改成你上传的牌背图片路径；所有未翻开的牌都会使用它
  cardBackImage: './assets/card-back.jpg',

  cardPlaceholderImage: './assets/card-face-placeholder.svg',

  majorArcanaFolder: './大阿尔卡那',
  minorArcanaFolder: './小阿尔卡那',

  spreads: {
    single: { title: '单牌解读', kicker: 'ONE CARD', positions: ['此刻的指引'] },
    three: { title: '时间之流', kicker: 'THREE CARDS', positions: ['过去', '现在', '未来'] },
  },
};

const PLACEHOLDER_SVG = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 1035">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#4a3267"/><stop offset="1" stop-color="#120a25"/></linearGradient>
      <radialGradient id="light" cx="50%" cy="42%" r="45%"><stop stop-color="#f7d88f" stop-opacity=".45"/><stop offset="1" stop-color="#f7d88f" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="640" height="1035" fill="url(#bg)"/>
    <rect x="24" y="24" width="592" height="987" rx="18" fill="none" stroke="#e5bd72" stroke-width="4"/>
    <rect x="42" y="42" width="556" height="951" rx="13" fill="none" stroke="#e5bd72" stroke-opacity=".45" stroke-width="2"/>
    <circle cx="320" cy="493" r="205" fill="url(#light)"/>
    <circle cx="320" cy="493" r="130" fill="none" stroke="#f6d58b" stroke-opacity=".8" stroke-width="4"/>
    <path d="M320 305 L353 435 L489 435 L379 516 L420 646 L320 565 L220 646 L261 516 L151 435 L287 435 Z" fill="#f6d58b" fill-opacity=".8"/>
    <text x="320" y="780" fill="#f8eed4" font-size="28" text-anchor="middle" font-family="serif">GEMSTONE TAROT</text>
  </svg>
`)}`;

const CATEGORY_LABELS = {
  major: '大阿尔卡那',
  wands: '权杖',
  cups: '圣杯',
  swords: '宝剑',
  pentacles: '星币',
};

const state = {
  page: 'home',
  previousPage: 'home',
  spreadKey: 'three',
  deck: [],
  selectedIndex: 0,
  deckPosition: 0,
  renderFrame: null,
  drawnCards: [],
    newestDrawnCardIndex: -1,
  libraryFilter: 'all',
  librarySearch: '',

  // 抽牌物理交互状态
  drag: null,
  inertiaFrame: null,
  inertiaVelocity: 0,
  wheelTimer: null,

  toastTimer: null,
  musicPlaying: false,
};

const elements = {
  pages: [...document.querySelectorAll('.page')],
  deckTrack: document.querySelector('#deck-track'),
  deckViewport: document.querySelector('#deck-viewport'),
  drawButton: document.querySelector('#draw-current-card'),
  drawnCards: document.querySelector('#drawn-cards'),
  deckCounter: document.querySelector('#deck-counter'),
  drawTitle: document.querySelector('#draw-spread-title'),
  drawKicker: document.querySelector('#draw-spread-kicker'),
  resultTitle: document.querySelector('#result-title'),
  resultCards: document.querySelector('#result-cards'),
  resultActions: document.querySelector('#result-actions'),
  libraryList: document.querySelector('#library-list'),
  librarySearch: document.querySelector('#library-search'),
  libraryFilters: document.querySelector('#library-filters'),
  detailContent: document.querySelector('#card-detail-content'),
  toast: document.querySelector('#toast'),
  musicToggle: document.querySelector('.music-toggle'),
backgroundMusic: document.querySelector('#background-music'),
};

function initialize() {
  document.title = SITE_CONFIG.title;
  document.documentElement.style.setProperty('--bg-image', `url("${SITE_CONFIG.backgroundImage}")`);
  document.documentElement.style.setProperty('--card-back-image', `url("${SITE_CONFIG.cardBackImage}")`);

  initializeGemstoneOrbit();
  bindEvents();
  goToPage('home');
}

function bindEvents() {
  document.addEventListener('click', handleClick);

  elements.librarySearch?.addEventListener('input', (event) => {
    state.librarySearch = event.target.value.trim();
    renderLibrary();
  });

  elements.deckViewport?.addEventListener('pointerdown', startDeckDrag);
  elements.deckViewport?.addEventListener('pointermove', moveDeckDrag);
  elements.deckViewport?.addEventListener('pointerup', endDeckDrag);
  elements.deckViewport?.addEventListener('pointercancel', endDeckDrag);
  elements.deckViewport?.addEventListener('lostpointercapture', endDeckDrag);
  elements.deckViewport?.addEventListener('wheel', handleDeckWheel, { passive: false });
  elements.deckViewport?.addEventListener('keydown', handleDeckKeydown);

  window.addEventListener('resize', () => {
    if (state.page === 'draw') renderDeck();
  });
}

function toggleBackgroundMusic() {
  const audio = elements.backgroundMusic;

  if (!SITE_CONFIG.backgroundMusic || !elements.musicToggle || !audio) {
    return;
  }

  if (!audio.src) {
    audio.src = SITE_CONFIG.backgroundMusic;
    audio.volume = 0.45;
  }

  if (audio.paused) {
    audio.play()
      .then(() => {
        state.musicPlaying = true;
        elements.musicToggle.setAttribute('aria-label', '暂停背景音乐');
        elements.musicToggle.setAttribute('aria-pressed', 'true');
        elements.musicToggle.title = '暂停背景音乐';
        elements.musicToggle.classList.add('is-playing');
      })
      .catch(() => {
        state.musicPlaying = false;
        showToast('音乐无法播放，请检查音频文件路径或浏览器播放权限。');
      });
  } else {
    audio.pause();
    state.musicPlaying = false;
    elements.musicToggle.setAttribute('aria-label', '播放背景音乐');
    elements.musicToggle.setAttribute('aria-pressed', 'false');
    elements.musicToggle.title = '播放背景音乐';
    elements.musicToggle.classList.remove('is-playing');
  }
}

function handleClick(event) {
  const target = event.target.closest('[data-action], [data-filter], .keyword-chip');
  if (!target) return;

  if (target.classList.contains('keyword-chip')) {
    const interpretation = target.closest('.result-card__interpretation');
    interpretation?.querySelector('.full-interpretation')?.classList.toggle('is-open');
    target.classList.toggle('is-selected');
    return;
  }

  if (target.dataset.filter) {
    state.libraryFilter = target.dataset.filter;

    elements.libraryFilters?.querySelectorAll('.filter-chip').forEach((button) => {
      button.classList.toggle('is-active', button === target);
    });

    renderLibrary();
    return;
  }

  switch (target.dataset.action) {
    case 'toggle-music':
      toggleBackgroundMusic();
      break;

    case 'start-reading':
      startReading(target.dataset.spread);
      break;

    case 'draw-current-card':
      drawCurrentCard();
      break;

    case 'back-home':
      stopDeckInertia();
      goToPage('home');
      break;

    case 'open-library':
      stopDeckInertia();
      state.previousPage = state.page;
      goToPage('library');
      break;

    case 'go-back':
      goToPage(state.previousPage || 'home');
      break;

    case 'restart-reading':
      startReading(state.spreadKey);
      break;

    case 'back-library':
      goToPage('library');
      break;

    case 'open-card-detail':
      openCardDetail(target.dataset.cardId);
      break;

    default:
      break;
  }
}

function goToPage(pageName) {
  state.page = pageName;

  elements.pages.forEach((page) => {
    const active = page.dataset.page === pageName;
    page.hidden = !active;
    page.classList.toggle('is-active', active);
  });

  if (pageName === 'library') renderLibrary();

  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
}

function startReading(spreadKey) {
  state.spreadKey = spreadKey === 'single' ? 'single' : 'three';
  stopDeckInertia();

  /*
   * 关键逻辑：deckOrder 是「本轮洗牌后的固定序号」。
   * 它和卡牌固定 order 无关，也不会因前面的卡被抽走而变化。
   */
  state.deck = shuffle(tarotCards).map((card, index) => ({
    ...card,
    deckOrder: index + 1,
  }));

 state.selectedIndex = Math.floor(state.deck.length / 2);
 state.deckPosition = state.selectedIndex;
 state.drawnCards = [];
 state.newestDrawnCardIndex = -1;

  const spread = SITE_CONFIG.spreads[state.spreadKey];

  if (elements.drawTitle) elements.drawTitle.textContent = spread.title;
  if (elements.drawKicker) elements.drawKicker.textContent = spread.kicker;
  if (elements.resultTitle) elements.resultTitle.textContent = spread.title;
  if (elements.drawnCards) elements.drawnCards.innerHTML = '';
  if (elements.drawButton) {
  elements.drawButton.textContent = '抽取这张牌';
  elements.drawButton.setAttribute('aria-label', '抽取这张牌');
}

  goToPage('draw');
  renderDeck();
  updateDrawControls();
}

function shuffle(cards) {
  const result = [...cards];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }

  return result;
}

function isCompactPortrait() {
  return window.matchMedia('(max-width: 767px) and (orientation: portrait)').matches;
}

function scheduleDeckRender() {
  if (state.renderFrame) return;

  state.renderFrame = requestAnimationFrame(() => {
    state.renderFrame = null;
    renderDeck();
  });
}

function setDeckPosition(nextPosition, immediate = false) {
  if (!state.deck.length) return;

  state.deckPosition = clamp(nextPosition, 0, state.deck.length - 1);
  state.selectedIndex = Math.round(state.deckPosition);

  if (immediate) {
    renderDeck();
  } else {
    scheduleDeckRender();
  }
}

function renderDeck() {
  if (state.page !== 'draw' || !elements.deckTrack || !elements.deckViewport) return;

  if (!state.deck.length) {
    elements.deckTrack.innerHTML = '';
    updateDrawControls();
    return;
  }

  const compact = isCompactPortrait();
  const viewportWidth = elements.deckViewport.clientWidth || window.innerWidth;
  const cardWidth = compact
    ? Math.max(68, Math.min(94, viewportWidth * 0.22))
    : Math.max(88, Math.min(158, viewportWidth * 0.105));

  const visibleRange = compact ? 7 : 14;
  const spacing = compact ? 0 : cardWidth * 0.54;
  const centeredIndex = Math.round(state.deckPosition);

  elements.deckTrack.innerHTML = state.deck.map((card, index) => {
    // 核心：这里是连续小数，不再是每次只移动一张。
    const distance = index - state.deckPosition;
    const absoluteDistance = Math.abs(distance);
    const active = index === centeredIndex;
    const visible = absoluteDistance <= visibleRange;

    let x;
    let y;
    let angle;
    let scale;

    if (compact) {
      // 手机竖屏：左侧纵向牌堆。
      x = distance * 4;
      y = distance * 40 - (active ? 18 : 0);
      angle = distance * 7.2;
      scale = Math.max(0.69, 1 - absoluteDistance * 0.045) + (active ? 0.05 : 0);
    } else {
      // 桌面：横向移动的大弧形；选中的牌留在画面中上方。
      x = distance * spacing;
      y = Math.min(620, absoluteDistance * absoluteDistance * 2.6) - (active ? 48 : 0);
      angle = distance * 5.5;
      scale = Math.max(0.7, 1 - absoluteDistance * 0.032) + (active ? 0.085 : 0);
    }

    const transform = `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${angle}deg) scale(${scale})`;

    return `
      <button
        class="deck-card ${active ? 'is-active' : ''}"
        type="button"
        data-deck-index="${index}"
        aria-label="选择本轮洗牌后的第 ${card.deckOrder} 张牌"
        style="
          z-index: ${300 - Math.round(absoluteDistance * 10)};
          opacity: ${visible ? 1 : 0};
          pointer-events: ${visible ? 'auto' : 'none'};
          transform: ${transform};
        "
      >
        <span class="deck-card__back">
          <span class="deck-card__number">${String(card.deckOrder).padStart(2, '0')}</span>
        </span>
      </button>
    `;
  }).join('');

  elements.deckTrack.querySelectorAll('[data-deck-index]').forEach((cardElement) => {
    cardElement.addEventListener('click', () => {
      const clickedIndex = Number(cardElement.dataset.deckIndex);

      if (clickedIndex === state.selectedIndex) {
        drawCurrentCard();
        return;
      }

      stopDeckInertia();
      setDeckPosition(clickedIndex, true);
    });
  });

  updateDrawControls();
}

function updateDrawControls() {
  if (!elements.drawButton) return;

  const positions = SITE_CONFIG.spreads[state.spreadKey].positions;
  const hasDrawnAllCards = state.drawnCards.length >= positions.length;

  if (hasDrawnAllCards) {
    elements.drawButton.textContent = '解读';
    elements.drawButton.setAttribute('aria-label', '查看本次抽牌解读');
    elements.drawButton.disabled = false;
    return;
  }

  elements.drawButton.textContent = '抽取这张牌';
  elements.drawButton.setAttribute('aria-label', '抽取这张牌');
  elements.drawButton.disabled = state.deck.length === 0;
}

function stopDeckInertia() {
  if (state.inertiaFrame) {
    cancelAnimationFrame(state.inertiaFrame);
    state.inertiaFrame = null;
  }

  if (state.renderFrame) {
    cancelAnimationFrame(state.renderFrame);
    state.renderFrame = null;
  }

  window.clearTimeout(state.wheelTimer);
  state.inertiaVelocity = 0;
}

function startDeckDrag(event) {
  if (!state.deck.length) return;

  stopDeckInertia();

  const compact = isCompactPortrait();
  const point = compact ? event.clientY : event.clientX;

  state.drag = {
    compact,
    startPoint: point,
    startPosition: state.deckPosition,
    lastPoint: point,
    lastTime: performance.now(),
    velocity: 0,
    hasMoved: false,
  };

  elements.deckViewport?.setPointerCapture?.(event.pointerId);
  elements.deckViewport?.classList.add('is-dragging');
}

function moveDeckDrag(event) {
  if (!state.drag || !state.deck.length) return;

  const point = state.drag.compact ? event.clientY : event.clientX;
  const now = performance.now();
  const delta = point - state.drag.lastPoint;
  const elapsed = Math.max(8, now - state.drag.lastTime);
  const pixelsPerCard = state.drag.compact ? 54 : 82;
  const totalMovement = point - state.drag.startPoint;

  if (Math.abs(totalMovement) > 4) {
    state.drag.hasMoved = true;
  }

  // 拖动多少像素，就连续推进多少张牌的位置。
  const nextPosition = state.drag.startPosition - totalMovement / pixelsPerCard;
  setDeckPosition(nextPosition);

  state.drag.velocity = -(delta / elapsed) / pixelsPerCard;
  state.drag.lastPoint = point;
  state.drag.lastTime = now;
}

function endDeckDrag(event) {
  if (!state.drag) return;

  const velocity = state.drag.velocity;
  const moved = state.drag.hasMoved;
  const target = event.target.closest('[data-deck-index]');

  state.drag = null;
  elements.deckViewport?.classList.remove('is-dragging');

  if (!moved && target && Number(target.dataset.deckIndex) === state.selectedIndex) {
    drawCurrentCard();
    return;
  }

  if (Math.abs(velocity) > 0.0013) {
    startDeckInertia(velocity);
  } else {
    setDeckPosition(Math.round(state.deckPosition), true);
  }
}

function startDeckInertia(initialVelocity) {
  if (!state.deck.length) return;

  if (state.inertiaFrame) {
    cancelAnimationFrame(state.inertiaFrame);
  }

  let velocity = initialVelocity;
  let lastTime = performance.now();

  const animate = (now) => {
    const elapsed = Math.min(34, now - lastTime);
    lastTime = now;

    let nextPosition = state.deckPosition + velocity * elapsed;
    const maximum = state.deck.length - 1;

    if (nextPosition < 0) {
      nextPosition = 0;
      velocity *= -0.26;
      triggerDeckBump();
    }

    if (nextPosition > maximum) {
      nextPosition = maximum;
      velocity *= -0.26;
      triggerDeckBump();
    }

    setDeckPosition(nextPosition);

    // 减速较慢，因此甩动会有明显的滑行动感。
    velocity *= Math.pow(0.993, elapsed);

    if (Math.abs(velocity) > 0.00018) {
      state.inertiaFrame = requestAnimationFrame(animate);
    } else {
      state.inertiaFrame = null;
      state.inertiaVelocity = 0;
      setDeckPosition(Math.round(state.deckPosition), true);
    }
  };

  state.inertiaVelocity = initialVelocity;
  state.inertiaFrame = requestAnimationFrame(animate);
}

function triggerDeckBump() {
  elements.deckViewport?.classList.remove('is-bumping');

  requestAnimationFrame(() => {
    elements.deckViewport?.classList.add('is-bumping');
  });
}

function handleDeckWheel(event) {
  event.preventDefault();
  if (!state.deck.length) return;

  const distance = Math.abs(event.deltaY) > Math.abs(event.deltaX)
    ? event.deltaY
    : event.deltaX;

  if (Math.abs(distance) < 1) return;

  const direction = distance > 0 ? 1 : -1;
  const immediateDistance = Math.min(1.35, Math.abs(distance) / 90);

  setDeckPosition(state.deckPosition + direction * immediateDistance);

  window.clearTimeout(state.wheelTimer);
  state.inertiaVelocity += direction * Math.min(0.013, Math.abs(distance) / 9000);

  state.wheelTimer = window.setTimeout(() => {
    if (Math.abs(state.inertiaVelocity) > 0.001) {
      startDeckInertia(state.inertiaVelocity);
    }
  }, 55);
}

function handleDeckKeydown(event) {
  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
    event.preventDefault();
    stopDeckInertia();
    setDeckPosition(state.deckPosition + 1, true);
  }

  if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
    event.preventDefault();
    stopDeckInertia();
    setDeckPosition(state.deckPosition - 1, true);
  }

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    drawCurrentCard();
  }
}

function selectDeckOffset(offset) {
  setDeckPosition(state.deckPosition + offset, true);
}

function drawCurrentCard() {
  stopDeckInertia();

  const positions = SITE_CONFIG.spreads[state.spreadKey].positions;

  if (state.drawnCards.length >= positions.length) {
    showResults();
    return;
  }

  if (!state.deck.length) return;

  const [card] = state.deck.splice(state.selectedIndex, 1);

  state.drawnCards.push({
    ...card,
    orientation: Math.random() >= 0.5 ? 'upright' : 'reversed',
    position: positions[state.drawnCards.length],
  });

  // 仅标记本次刚抽出的牌；下一次渲染时，只有它会播放抽牌动画。
  state.newestDrawnCardIndex = state.drawnCards.length - 1;

state.deckPosition = clamp(
  state.deckPosition,
  0,
  Math.max(0, state.deck.length - 1),
);
state.selectedIndex = Math.round(state.deckPosition);

  renderDrawnCards();
  renderDeck();

if (state.drawnCards.length === positions.length) {
  showToast('所有卡牌已抽取，点击“解读”查看结果。');
}
}

function renderDrawnCards() {
  if (!elements.drawnCards) return;

  elements.drawnCards.innerHTML = state.drawnCards.map((card, index) => {
    const isNewest = index === state.newestDrawnCardIndex;

    return `
      <div class="drawn-slot ${isNewest ? 'is-newly-drawn' : ''}">
        <div class="drawn-slot__card"></div>
        <span class="drawn-slot__label">${escapeHtml(card.position)}</span>
      </div>
    `;
  }).join('');
}

function showResults() {
  if (!state.drawnCards.length) return;

  gemstoneOrbit?.burst();
  goToPage('result');
  renderResults();
}

function renderResults() {
  if (!elements.resultCards) return;

  elements.resultCards.style.setProperty('--result-count', state.drawnCards.length);

  if (elements.resultActions) {
    elements.resultActions.hidden = true;
  }

  elements.resultCards.innerHTML = state.drawnCards.map((card, index) => {
    const meaning = card[card.orientation];
    const moon = card.orientation === 'upright'
      ? '<span class="moon-phase moon-phase--full" aria-label="满月，代表正位">●</span> 满月'
      : '<span class="moon-phase moon-phase--new" aria-label="朔月，代表逆位">●</span> 朔月';

    return `
      <article class="result-card" style="animation-delay:${index * 130}ms">
        <p class="result-card__position">${escapeHtml(card.position)}</p>

        <div class="tarot-flip-card" data-result-card="${index}">
          <div class="tarot-flip-card__inner">
            <div class="tarot-flip-card__face tarot-flip-card__back"></div>
            <div class="tarot-flip-card__face tarot-flip-card__front">
              <img
                src="${escapeAttribute(card.image)}"
                alt="${escapeAttribute(card.name)}"
                class="${card.orientation === 'reversed' ? 'is-reversed' : ''}"
                data-fallback-image
              >
            </div>
          </div>
        </div>

        <div class="result-card__interpretation" hidden>
          <p class="result-card__orientation">${moon}</p>
          <h3 class="result-card__name">${escapeHtml(card.name)}</h3>
          <p class="result-card__gemstone">${escapeHtml(card.gemstoneName)}</p>
          <p class="result-card__short-text">${escapeHtml(meaning.shortText)}</p>

          <div class="keyword-list">
            ${meaning.keywords.map((keyword) => `
              <button class="keyword-chip" type="button">${escapeHtml(keyword)}</button>
            `).join('')}
          </div>

          <div class="full-interpretation">${meaning.fullInterpretation}</div>
        </div>
      </article>
    `;
  }).join('');

  attachImageFallbacks(elements.resultCards);

  const isPortraitThreeCardReading =
    isCompactPortrait() && state.drawnCards.length === 3;

  if (isPortraitThreeCardReading) {
    setupSwipeReveal();
  } else {
    // 电脑端、横屏与单牌阵：自动依次翻开全部牌。
    revealResultCards();
  }
}

/* 手机竖屏三牌阵：默认翻开「现在」，滑动到其他牌时再翻开。 */
function setupSwipeReveal() {
  if (!elements.resultCards) return;

  const container = elements.resultCards;
  const cards = [...container.querySelectorAll('.result-card')];

  if (cards.length !== 3) return;

  let scrollTimer = null;
  let userHasInteracted = false;

  const revealCard = (card) => {
    const flipCard = card?.querySelector('.tarot-flip-card');

    if (!flipCard || flipCard.classList.contains('is-revealed')) return;

    flipCard.classList.add('is-revealed');

    window.setTimeout(() => {
      card.querySelector('.result-card__interpretation')?.removeAttribute('hidden');

      const allRevealed = cards.every((item) =>
        item.querySelector('.tarot-flip-card')?.classList.contains('is-revealed')
      );

      if (allRevealed && elements.resultActions) {
        elements.resultActions.hidden = false;
      }
    }, 820);
  };

  const revealCenteredCard = () => {
    if (!userHasInteracted) return;

    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;

    let currentCard = null;
    let nearestDistance = Infinity;

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;
      const distance = Math.abs(cardCenter - containerCenter);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        currentCard = card;
      }
    });

    revealCard(currentCard);
  };

  const scheduleReveal = (delay = 180) => {
    window.clearTimeout(scrollTimer);
    scrollTimer = window.setTimeout(revealCenteredCard, delay);
  };

  requestAnimationFrame(() => {
    container.scrollTo({
      left: cards[1].offsetLeft,
      behavior: 'auto',
    });

    requestAnimationFrame(() => revealCard(cards[1]));
  });

  container.addEventListener('pointerdown', () => {
    userHasInteracted = true;
  }, { passive: true });

  container.addEventListener('scroll', () => {
    if (userHasInteracted) scheduleReveal();
  }, { passive: true });

  container.addEventListener('pointerup', () => {
    if (userHasInteracted) scheduleReveal(260);
  }, { passive: true });

  container.addEventListener('pointercancel', () => {
    if (userHasInteracted) scheduleReveal(260);
  }, { passive: true });
}

/* 电脑端、横屏和单牌阵：逐张自动翻牌。 */
function revealResultCards(startDelay = 0) {
  if (!elements.resultCards) return;

  const cards = [...elements.resultCards.querySelectorAll('.result-card')];

  cards.forEach((card, index) => {
    window.setTimeout(() => {
      const flipCard = card.querySelector('.tarot-flip-card');

      if (!flipCard || flipCard.classList.contains('is-revealed')) return;

      flipCard.classList.add('is-revealed');

      window.setTimeout(() => {
        card.querySelector('.result-card__interpretation')?.removeAttribute('hidden');

        const allRevealed = cards.every((item) =>
          item.querySelector('.tarot-flip-card')?.classList.contains('is-revealed')
        );

        if (allRevealed && elements.resultActions) {
          elements.resultActions.hidden = false;
        }
      }, 820);
    }, startDelay + index * 180);
  });
}
function renderLibrary() {
  if (!elements.libraryList) return;

  const keyword = state.librarySearch.toLocaleLowerCase();

  const cards = tarotCards.filter((card) => {
    const categoryMatched = state.libraryFilter === 'all' || card.category === state.libraryFilter;
    const text = `${card.name} ${card.gemstoneName} ${getCategoryLabel(card.category)}`.toLocaleLowerCase();
    return categoryMatched && text.includes(keyword);
  });

  if (!cards.length) {
    elements.libraryList.innerHTML = '<p class="library-empty">没有找到符合条件的卡牌。</p>';
    return;
  }

  elements.libraryList.innerHTML = cards.map((card) => `
    <button
      class="library-item"
      type="button"
      data-action="open-card-detail"
      data-card-id="${escapeAttribute(card.id)}"
    >
      <span class="library-item__image">
        <img src="${escapeAttribute(card.image)}" alt="" data-fallback-image>
      </span>
      <span>
        <span class="library-item__category">${escapeHtml(getCategoryLabel(card.category))}</span>
        <strong class="library-item__name">${escapeHtml(card.name)}</strong>
        <span class="library-item__gemstone">${escapeHtml(card.gemstoneName)}</span>
      </span>
      <span class="library-item__arrow" aria-hidden="true">›</span>
    </button>
  `).join('');

  attachImageFallbacks(elements.libraryList);
}

function openCardDetail(cardId) {
  const card = tarotCards.find((item) => item.id === cardId);
  if (!card || !elements.detailContent) return;

  state.previousPage = 'library';

  elements.detailContent.innerHTML = `
    <section class="detail-card-summary">
      <div class="detail-card-summary__image">
        <img src="${escapeAttribute(card.image)}" alt="${escapeAttribute(card.name)}" data-fallback-image>
      </div>
      <p class="detail-card-summary__category">${escapeHtml(getCategoryLabel(card.category))}</p>
      <h1>${escapeHtml(card.name)}</h1>
      <p class="detail-card-summary__gemstone">${escapeHtml(card.gemstoneName)}</p>
    </section>

    ${renderDetailMeaning(card.upright, 'upright')}
    ${renderDetailMeaning(card.reversed, 'reversed')}
  `;

  attachImageFallbacks(elements.detailContent);
  goToPage('detail');
}

function renderDetailMeaning(meaning, type) {
  const moonLabel = type === 'upright'
    ? '<span class="moon-phase moon-phase--full" aria-hidden="true">●</span> 满月'
    : '<span class="moon-phase moon-phase--new" aria-hidden="true">●</span> 朔月';

  return `
    <section class="detail-meaning-panel detail-meaning-panel--${type}">
      <span class="detail-meaning-panel__label">${moonLabel}</span>
      <h2>${escapeHtml(meaning.shortText)}</h2>
      <div class="detail-meaning-panel__keywords">
        ${meaning.keywords.map((keyword) => `<span>${escapeHtml(keyword)}</span>`).join('')}
      </div>
     <div class="detail-meaning-panel__full">${meaning.fullInterpretation}</div>
    </section>
  `;
}

function getCategoryLabel(category) {
  return CATEGORY_LABELS[category] || '塔罗牌';
}

function attachImageFallbacks(container) {
  container.querySelectorAll('[data-fallback-image]').forEach((image) => {
    image.addEventListener('error', () => {
      if (image.dataset.fallbackApplied === 'true') return;
      image.dataset.fallbackApplied = 'true';
      image.src = PLACEHOLDER_SVG;
    }, { once: true });
  });
}

function showToast(message) {
  if (!elements.toast) return;

  window.clearTimeout(state.toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.add('is-visible');

  state.toastTimer = window.setTimeout(() => {
    elements.toast.classList.remove('is-visible');
  }, 2600);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function escapeAttribute(value) {
  return escapeHtml(value);
}

/*
 * 宝石同心圆参数。
 *
 * x / y：圆环中心的位置，0.5 即视口中心。
 * ringStart：最内圈半径，占屏幕短边的比例。
 * ringGap：圆环的目标行距，占屏幕短边的比例，数值越大圆环越疏。
 * ringMax：最外圈可扩展到的最大半径，占屏幕短边的比例。
 * minTextGap：同一圆环上，名称之间至少保留的像素间距。
 * fontSize：宝石名称字号。
 *
 * 圆环数量不再固定。程序会根据名称宽度、圆环周长与 minTextGap
 * 自动增加外圈；当可用半径不足时，会在保证名称不重叠的前提下
 * 适度缩小实际行距。
 */
const GEMSTONE_ORBIT_CONFIG = {
  desktop: {
    x: 0.5,
    y: 0.5,
    ringStart: 0.21,
    ringGap: 0.01,
    ringMax: 0.78,
    minTextGap: 22,
    fontSize: 13,
    particleCount: 150,
    burstDuration: 2200,
  },

  portrait: {
    x: 0.5,
    y: 0.48,
    ringStart: 0.23,
    ringGap: 0.105,
    ringMax: 0.90,
    minTextGap: 18,
    fontSize: 11,
    particleCount: 110,
    burstDuration: 2000,
  },

  landscape: {
    x: 0.5,
    y: 0.5,
    ringStart: 0.22,
    ringGap: 0.12,
    ringMax: 0.82,
    minTextGap: 20,
    fontSize: 12,
    particleCount: 135,
    burstDuration: 2100,
  },
};

// 圆环中心留白比例：0.32 表示留出屏幕短边 32% 的半径。
// 数值越大，最内圈离中心越远，中心留白越大。
const GEMSTONE_CENTER_BLANK_RATIO = 0.40;

// 圆环整体的垂直中心位置：0.5 是屏幕正中；数值越大越往下。
const GEMSTONE_CENTER_Y = 0.65;

let gemstoneOrbit = null;

function getGemstoneOrbitConfig() {
  if (window.matchMedia('(max-width: 767px) and (orientation: portrait)').matches) {
    return GEMSTONE_ORBIT_CONFIG.portrait;
  }

  if (window.matchMedia('(orientation: landscape)').matches) {
    return GEMSTONE_ORBIT_CONFIG.landscape;
  }

  return GEMSTONE_ORBIT_CONFIG.desktop;
}

function initializeGemstoneOrbit() {
  const canvas = document.querySelector('#gemstone-orbit');
  if (!canvas) return;

  const names = tarotCards
    .map((card) => card.gemstoneName)
    .filter(Boolean);

  gemstoneOrbit = createGemstoneOrbit(canvas, names);
}

function createGemstoneOrbit(canvas, gemstoneNames) {
  const context = canvas.getContext('2d');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const orbit = {
    canvas,
    context,
    names: gemstoneNames,
    rings: [],
    particles: [],
    width: 0,
    height: 0,
    dpr: 1,
    startedAt: performance.now(),
    burstStartedAt: 0,
    frame: null,
  };

  const randomize = (items) => {
    const result = [...items];

    for (let index = result.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
    }

    return result;
  };

const rebuildRings = () => {
  const config = getGemstoneOrbitConfig();
  const names = randomize(orbit.names);
  const shortEdge = Math.min(orbit.width, orbit.height);

  // Canvas 的字体设置必须与 draw() 保持一致，
  // 才能用实际文字宽度准确计算一圈可容纳的名称数量。
  context.font = `300 ${config.fontSize}px "Noto Serif SC", serif`;

  const labels = names.map((name) => ({
    name,
    opacity: 0.18 + Math.random() * 0.48,
    shimmerOffset: Math.random() * Math.PI * 2,

    // 名称实际宽度 + 两侧留白，用于避免同一圈的文字碰撞。
    requiredWidth: context.measureText(name).width + config.minTextGap,
  }));

  /*
   * 先按设置的目标行距生成圆环。
   * 如果现有圈数不足以容纳所有名称，后续会自动补充圆环。
   */
   // 强制统一控制中心留白，不受 desktop / portrait / landscape 配置影响。
      const centerBlankRadius = Math.max(
     config.ringStart,
     GEMSTONE_CENTER_BLANK_RATIO,
   );

   const requestedRadii = [];

   for (
     let radius = centerBlankRadius;
     radius <= config.ringMax + 0.0001;
     radius += config.ringGap
   ) {
     requestedRadii.push(radius);
   }

  /*
   * 根据圆周长和每个名称所需宽度，为每圈分配名称。
   * 内圈周长短，天然只会分到少量名称；
   * 外圈周长长，会自动承载更多名称。
   */
  const assignLabelsToRings = (radii) => {
    let labelIndex = 0;

    const rings = radii.map((radius, ringIndex) => {
      const circumference = Math.PI * 2 * shortEdge * radius;
      const ringLabels = [];
      let usedWidth = 0;

      while (labelIndex < labels.length) {
        const label = labels[labelIndex];

        // 每圈至少容纳一个名称，避免窄小屏幕出现空环。
        const canFit = ringLabels.length === 0
          || usedWidth + label.requiredWidth <= circumference;

        if (!canFit) break;

        ringLabels.push(label);
        usedWidth += label.requiredWidth;
        labelIndex += 1;
      }

      return {
        radius,
        speed: 0,
        phase: Math.random() * Math.PI * 2,
        labels: ringLabels,
        ringIndex,
      };
    });

    return { rings, remainingCount: labels.length - labelIndex };
  };

  let radii = requestedRadii;
  let layout = assignLabelsToRings(radii);

  /*
   * 若在最大半径内仍放不下全部名称，则在 ringMax 范围内自动增加圆环。
   * 这会缩小实际行距，但不会压缩同一圈名称的横向间距。
   */
  while (layout.remainingCount > 0) {
    const nextRingCount = radii.length + 1;
    const availableDistance = config.ringMax - centerBlankRadius;
    const adaptiveGap = availableDistance / Math.max(1, nextRingCount - 1);

    // 圈数达到 16 时停止，防止极端小尺寸下产生过多圆环。
    if (nextRingCount > 16 || adaptiveGap < 0.035) break;

    radii = Array.from(
      { length: nextRingCount },
      (_, index) => centerBlankRadius + adaptiveGap * index,
    );

    layout = assignLabelsToRings(radii);
  }

  /*
   * 极端情况下，例如非常窄的屏幕或名称异常长，
   * 继续向外增加圆环，确保所有 gemstoneName 都能显示。
   */
  while (layout.remainingCount > 0) {
    const lastRadius = radii.at(-1);
    radii.push(lastRadius + config.ringGap);
    layout = assignLabelsToRings(radii);
  }

  const baseSpeeds = [1.55, -1.05, 0.72, -0.48, 0.31, -0.22, 0.16, -0.12];

  orbit.rings = layout.rings
    .filter((ring) => ring.labels.length > 0)
    .map((ring, visibleIndex) => ({
      ...ring,

      // 偶数圈顺时针、奇数圈逆时针；越外层速度越慢。
      speed: (baseSpeeds[visibleIndex % baseSpeeds.length]
        / (1 + visibleIndex * 0.08)),
    }));
};

  const resize = () => {
    orbit.dpr = Math.min(window.devicePixelRatio || 1, 2);
    orbit.width = window.innerWidth;
    orbit.height = window.innerHeight;
    canvas.width = Math.round(orbit.width * orbit.dpr);
    canvas.height = Math.round(orbit.height * orbit.dpr);
    canvas.style.width = `${orbit.width}px`;
    canvas.style.height = `${orbit.height}px`;
    context.setTransform(orbit.dpr, 0, 0, orbit.dpr, 0, 0);
    rebuildRings();
  };

  const burst = () => {
    if (reducedMotion.matches) return;

    const config = getGemstoneOrbitConfig();
    const centerX = orbit.width * config.x;
    const centerY = orbit.height * GEMSTONE_CENTER_Y;
    const outerRing = orbit.rings.at(-1);
    const maxRadius = Math.min(orbit.width, orbit.height)
    * (outerRing?.radius || config.ringMax);

    orbit.burstStartedAt = performance.now();
    orbit.particles = Array.from({ length: config.particleCount }, () => {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * maxRadius;

      return {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        size: 0.7 + Math.random() * 0.75,
        opacity: 0.35 + Math.random() * 0.65,
        twinkle: Math.random() * Math.PI * 2,
      };
    });
  };

  const drawParticles = (now, burstProgress) => {
    if (!orbit.particles.length || burstProgress >= 1) return;

    context.save();
    context.globalCompositeOperation = 'screen';

    orbit.particles.forEach((particle) => {
      const shimmer = 0.55 + Math.sin(now * 0.012 + particle.twinkle) * 0.45;
      const alpha = (1 - burstProgress) * particle.opacity * shimmer;
      const size = particle.size * (1 + burstProgress * 0.7);

      context.fillStyle = `rgba(226, 240, 255, ${alpha})`;
      context.beginPath();
      context.arc(particle.x, particle.y, size, 0, Math.PI * 2);
      context.fill();
    });

    context.restore();
  };

/*
 * 将一段文字逐字排在圆弧上。
 * 每个字独立贴合圆环，因此整段文字的底部／基线会形成弧线。
 * 所有字的顶部始终朝向圆心。
 */
const drawTextOnInwardArc = ({
  text,
  centerX,
  centerY,
  radius,
  centerAngle,
  fillStyle,
}) => {
  const characters = Array.from(text);

  if (!characters.length || radius <= 0) return;

  // 用累计文本宽度计算推进距离，保留数字、英文、空格等的原始字距。
  const advances = characters.map((_, index) => (
    context.measureText(characters.slice(0, index + 1).join('')).width
  ));
    const totalWidth = advances.at(-1) || 0;

    context.save();
    context.textAlign = 'center';
    context.textBaseline = 'alphabetic';
    context.fillStyle = fillStyle;

    characters.forEach((character, index) => {
      const previousAdvance = index === 0 ? 0 : advances[index - 1];
      const characterWidth = advances[index] - previousAdvance;

      // 当前字中心相对名称中心的弧长，再转换成圆心角。
      const offset = previousAdvance + characterWidth / 2 - totalWidth / 2;
      const characterAngle = centerAngle + offset / radius;
      const x = centerX + Math.cos(characterAngle) * radius;
      const y = centerY + Math.sin(characterAngle) * radius;

      context.save();
      context.translate(x, y);
      context.rotate(characterAngle + Math.PI / 2);
      context.fillText(character, 0, 0);
      context.restore();
    });

    context.restore();
  };



  const draw = (now) => {
    const config = getGemstoneOrbitConfig();
    const elapsed = (now - orbit.startedAt) / 1000;
    const burstElapsed = orbit.burstStartedAt ? now - orbit.burstStartedAt : Infinity;
    const burstProgress = Math.min(1, burstElapsed / config.burstDuration);
    const speedMultiplier = burstProgress < 1
      ? 1 + (1 - burstProgress) * 5
      : 1;
    const centerX = orbit.width * config.x;
    const centerY = orbit.height * GEMSTONE_CENTER_Y;
    const shortEdge = Math.min(orbit.width, orbit.height);

    context.clearRect(0, 0, orbit.width, orbit.height);
    context.save();
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.font = `300 ${config.fontSize}px "Noto Serif SC", serif`;

    orbit.rings.forEach((ring) => {
      const radius = shortEdge * ring.radius;
      const rotation = ring.phase + (ring.speed * speedMultiplier * elapsed * Math.PI) / 180;
      const count = ring.labels.length;

      ring.labels.forEach((label, index) => {
        const angle = rotation + (index / count) * Math.PI * 2;
        const shimmer = 0.72 + Math.sin(now * 0.0015 + label.shimmerOffset) * 0.28;
        const opacity = label.opacity * shimmer;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        /*
        * 让每个宝石名称沿圆环切线排列，并让文字顶部始终朝向圆心。
        * angle 是该名称相对圆心的角度；减去 Math.PI / 2 后，文字的朝向会指向圆心。
        */
        drawTextOnInwardArc({
        text: label.name,
        centerX,
        centerY,
        radius,
        centerAngle: angle,
        fillStyle: `rgba(220, 209, 255, ${opacity})`,
      });
    });
 });
    context.restore();
    drawParticles(now, burstProgress);

    if (burstProgress >= 1 && orbit.particles.length) {
      orbit.particles = [];
      orbit.burstStartedAt = 0;
    }

    if (!reducedMotion.matches && !document.hidden) {
      orbit.frame = requestAnimationFrame(draw);
    }
  };

  const resume = () => {
    if (orbit.frame || document.hidden || reducedMotion.matches) return;
    orbit.startedAt = performance.now();
    orbit.frame = requestAnimationFrame((now) => {
      orbit.frame = null;
      draw(now);
    });
  };

  const pause = () => {
    if (!orbit.frame) return;
    cancelAnimationFrame(orbit.frame);
    orbit.frame = null;
  };

  window.addEventListener('resize', () => {
    resize();
    if (reducedMotion.matches) draw(performance.now());
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      pause();
    } else {
      resume();
    }
  });

  reducedMotion.addEventListener('change', () => {
    pause();
    draw(performance.now());
    resume();
  });

  resize();
  draw(performance.now());
  resume();

  return { burst };
}

initialize();