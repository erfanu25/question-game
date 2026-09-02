import "./style.css";

type Motif = "hearts" | "sparkles" | "frame" | "envelope";

type QuestionDef = {
  id: string;
  eyebrow: string;
  title: string;
  sub: string;
  yesLabel: string;
  noLabel: string;
  reaction: string;
  motif: Motif;
  isFinal?: boolean;
};

const QUESTIONS: QuestionDef[] = [
  { id: "first-smile", eyebrow: "A little warm-up", title: "Do you know that your smile can still fix my entire day?", sub: "I have been trying to earn that smile ever since.", yesLabel: "Of course I do", noLabel: "Remind me", reaction: "That smile is still my favorite view.", motif: "hearts" },
  { id: "laughter", eyebrow: "An important survey", title: "Do I still make you laugh, even when my jokes need a little help?", sub: "I promise to keep improving the material. Eventually.", yesLabel: "You make me laugh", noLabel: "The effort is cute", reaction: "Excellent. My comedy career lives another day.", motif: "sparkles" },
  { id: "safe-place", eyebrow: "The honest bit", title: "Do you know that being with you is still my favorite place to be?", sub: "No reservation needed. Just you and me.", yesLabel: "I know", noLabel: "Tell me more", reaction: "Good. I mean every word of it.", motif: "frame" },
  { id: "pasta", eyebrow: "Kitchen diplomacy", title: "Would you still love me if I burned the pasta again?", sub: "This is a hypothetical. Mostly.", yesLabel: "Always", noLabel: "Depends on the pasta", reaction: "I knew you would forgive my very ambitious cooking.", motif: "envelope" },
  { id: "dance", eyebrow: "A serious request", title: "Will you keep dancing with me, even when there is no music?", sub: "The kitchen counts as a dance floor, by the way.", yesLabel: "Always dance with you", noLabel: "Only if you lead", reaction: "Deal. I will try not to step on your toes.", motif: "hearts" },
  { id: "team", eyebrow: "Us against the world", title: "Are we still the best team, even on the busy and messy days?", sub: "Especially on those days, I think.", yesLabel: "The very best team", noLabel: "Obviously", reaction: "My favorite teammate, always.", motif: "sparkles" },
  { id: "little-things", eyebrow: "The small things", title: "Do you know how much I love the ordinary moments with you?", sub: "Coffee, errands, quiet evenings - all of it.", yesLabel: "I do now", noLabel: "Say it again", reaction: "Every ordinary day with you feels special to me.", motif: "frame" },
  { id: "apology", eyebrow: "A tiny apology", title: "Will you forgive me for the times I have been a little difficult?", sub: "I am still learning, but I will always choose us and try again.", yesLabel: "Always forgive you", noLabel: "Tell me what happened", reaction: "Thank you, my love. I am sorry, and I will do better.", motif: "envelope" },
  { id: "grateful", eyebrow: "From my heart", title: "Do you know how grateful I am that you are my wife?", sub: "You make our life warmer, brighter, and much more fun.", yesLabel: "I know, my love", noLabel: "I love you too", reaction: "I love you more than these little questions can say.", motif: "hearts" },
  { id: "forever", eyebrow: "One last thing", title: "Can I keep loving you forever?", sub: "Choose wisely. One button is feeling a little shy.", yesLabel: "Forever and always", noLabel: "Not a chance", reaction: "I knew forever sounded better with you in it.", motif: "sparkles", isFinal: true },
];

const CLOSING_MESSAGE = "You make every ordinary day feel extraordinary. I love you, today, tomorrow, and always.";
const RESTART_LABEL = "Play again";
const HUSBAND_NAME = "Erfan";
const WIFE_NAME = "Samina";
const APOLOGY_MESSAGES = [
  "I am sorry for the times I rushed, reacted badly, or made you feel unseen.",
  "I should have listened before defending myself, and I know that hurt you.",
  "You matter to me, and I want to do better with patience, honesty, and gentleness.",
  "I love you, and I want to choose you with more softness and more care."
];
const PROMISES = [
  { title: "Listen before I answer", text: "I will slow down, hear you out, and understand before I respond." },
  { title: "Make room for your feelings", text: "Your feelings are valid, and I will not make you shrink them for my comfort." },
  { title: "Choose patience", text: "When we are tired or stressed, I will choose patience over pride." },
  { title: "Do better every day", text: "I will work on being kinder, steadier, and more present with you." }
];
const app = document.querySelector<HTMLDivElement>("#app")!;
let currentIndex = 0;
let answered = false;
let reactionTimer: number | undefined;

function renderQuestion(): void {
  const question = QUESTIONS[currentIndex];
  answered = false;
  app.innerHTML = `
    <main class="page-shell">
      <div class="ambient ambient-one" aria-hidden="true"></div>
      <div class="ambient ambient-two" aria-hidden="true"></div>
      <div class="hearts" aria-hidden="true"><span>♥</span><span>♡</span><span>♥</span><span>♡</span></div>
      <header class="topbar"><span class="brand-mark">${HUSBAND_NAME} <b>♡</b> ${WIFE_NAME}</span><span class="question-count">${String(currentIndex + 1).padStart(2, "0")} <i>/</i> 10</span></header>
      <section class="game-area" aria-labelledby="question-title">
        <div class="progress" aria-label="Question progress"><span style="width: ${((currentIndex + 1) / QUESTIONS.length) * 100}%"></span></div>
        <div class="motif motif-${question.motif}" aria-hidden="true"><span></span><span></span><span></span></div>
        <p class="eyebrow">${question.eyebrow}</p>
        <h1 id="question-title">${question.title}</h1>
        <p class="subcopy">${question.sub}</p>
        <div class="answer-area" id="answer-area">
          <button class="answer answer-yes" type="button">${question.yesLabel}<span aria-hidden="true">↗</span></button>
          <button class="answer answer-no${question.isFinal ? " evasive" : ""}" type="button">${question.noLabel}</button>
        </div>
        <p class="reaction" id="reaction" aria-live="polite"></p>
      </section>
      <p class="quiet-note">a tiny love letter from ${HUSBAND_NAME} to ${WIFE_NAME}</p>
      <div class="live-region" aria-live="polite" aria-atomic="true"></div>
    </main>`;

  const yesButton = app.querySelector<HTMLButtonElement>(".answer-yes")!;
  const noButton = app.querySelector<HTMLButtonElement>(".answer-no")!;
  yesButton.addEventListener("click", () => choose(true));
  noButton.addEventListener("click", () => choose(false));
  if (question.isFinal) setupEvasiveButton(noButton);
}

function choose(isYes: boolean): void {
  if (answered) return;
  const question = QUESTIONS[currentIndex];
  if (question.isFinal && !isYes) return;
  answered = true;
  playChime(question.isFinal ? "celebration" : "answer");
  createHeartRain();
  app.querySelectorAll<HTMLButtonElement>(".answer").forEach((button) => { button.disabled = true; button.classList.add("selected"); });
  app.querySelector<HTMLElement>("#reaction")!.textContent = question.reaction;
  app.querySelector<HTMLElement>(".live-region")!.textContent = question.reaction;
  reactionTimer = window.setTimeout(() => {
    if (question.isFinal) renderSurprise();
    else { currentIndex += 1; renderQuestion(); }
  }, 1500);
}

function playChime(kind: "answer" | "celebration"): void {
  const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return;
  const audioContext = new AudioContextClass();
  const now = audioContext.currentTime;
  const notes = kind === "celebration" ? [523.25, 659.25, 783.99] : [659.25];
  notes.forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = kind === "celebration" ? "sine" : "triangle";
    oscillator.frequency.value = frequency;
    const start = now + index * 0.13;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(kind === "celebration" ? 0.12 : 0.06, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + (kind === "celebration" ? 0.72 : 0.3));
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start(start);
    oscillator.stop(start + (kind === "celebration" ? 0.75 : 0.34));
  });
  window.setTimeout(() => audioContext.close(), kind === "celebration" ? 1200 : 700);
}

function renderSurprise(): void {
  app.innerHTML = `<main class="surprise-screen"><div class="surprise-orbit" aria-hidden="true"><span>♡</span><span>♥</span><span>✦</span></div><div class="surprise-inner"><p class="eyebrow">Just for you, Samina</p><h1>One last surprise<span>...</span></h1><p class="surprise-copy">A little more love is on its way.</p><div class="surprise-dots" aria-hidden="true"><i></i><i></i><i></i></div></div><div class="live-region" aria-live="polite">One last surprise. A little more love is on its way.</div></main>`;
  reactionTimer = window.setTimeout(renderCelebration, 1800);
}

function createHeartRain(): void {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const rain = document.createElement("div");
  rain.className = "heart-rain";
  rain.setAttribute("aria-hidden", "true");
  for (let index = 0; index < 28; index += 1) {
    const heart = document.createElement("span");
    heart.textContent = index % 4 === 0 ? "♡" : "♥";
    heart.style.setProperty("--heart-left", `${Math.random() * 100}%`);
    heart.style.setProperty("--heart-delay", `${Math.random() * 0.55}s`);
    heart.style.setProperty("--heart-duration", `${1.6 + Math.random() * 1.4}s`);
    heart.style.setProperty("--heart-size", `${12 + Math.random() * 17}px`);
    heart.style.setProperty("--heart-tilt", `${-35 + Math.random() * 70}deg`);
    rain.appendChild(heart);
  }
  document.body.appendChild(rain);
  window.setTimeout(() => rain.remove(), 3400);
}

function setupEvasiveButton(button: HTMLButtonElement): void {
  let dodgeCount = 0;
  let lastX = -1000;
  let lastY = -1000;
  let burstActive = false;
  const move = (event?: Event, shouldShrink = true): void => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || answered) return;
    event?.preventDefault();
    if (shouldShrink) dodgeCount += 1;
    const areaRect = { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
    const yesRect = app.querySelector<HTMLButtonElement>(".answer-yes")!.getBoundingClientRect();
    if (!shouldShrink) {
      const isMobile = window.matchMedia("(max-width: 560px)").matches;
      const besideX = yesRect.right + 14;
      const initialX = !isMobile && besideX + button.offsetWidth <= window.innerWidth - 12 ? besideX : yesRect.left;
      const initialY = !isMobile && initialX === besideX ? yesRect.top : yesRect.bottom + 14;
      button.style.left = `${initialX}px`;
      button.style.top = `${initialY}px`;
      button.style.transform = "scale(1)";
      lastX = initialX;
      lastY = initialY;
      return;
    }
    const maxX = Math.max(0, areaRect.width - button.offsetWidth);
    const maxY = Math.max(0, areaRect.height - button.offsetHeight);
    const gap = 24;
    const yesLeft = yesRect.left - areaRect.left;
    const yesTop = yesRect.top - areaRect.top;
    const pointerEvent = event instanceof PointerEvent ? event : undefined;
    const pointerX = pointerEvent ? pointerEvent.clientX - areaRect.left : undefined;
    const pointerY = pointerEvent ? pointerEvent.clientY - areaRect.top : undefined;
    const isSafe = (candidateX: number, candidateY: number): boolean => {
      const candidate = { left: candidateX, right: candidateX + button.offsetWidth, top: candidateY, bottom: candidateY + button.offsetHeight };
      const awayFromYes = candidate.right < yesLeft - gap || candidate.left > yesLeft + yesRect.width + gap || candidate.bottom < yesTop - gap || candidate.top > yesTop + yesRect.height + gap;
      const movedEnough = Math.abs(candidateX - lastX) > 42 || Math.abs(candidateY - lastY) > 42;
      const awayFromPointer = pointerX === undefined || pointerY === undefined || Math.abs(candidateX - pointerX) > 70 || Math.abs(candidateY - pointerY) > 70;
      return awayFromYes && movedEnough && awayFromPointer;
    };
    let x = 0;
    let y = Math.min(maxY, yesTop + yesRect.height + gap);
    if (!isSafe(x, y)) y = Math.max(0, yesTop - button.offsetHeight - gap);
    for (let attempt = 0; attempt < 60; attempt += 1) {
      const candidateX = Math.random() * maxX;
      const candidateY = Math.random() * maxY;
      if (isSafe(candidateX, candidateY)) {
        x = candidateX;
        y = candidateY;
        break;
      }
    }
    button.style.left = `${x}px`;
    button.style.top = `${y}px`;
    const scale = Math.max(0.62, 1 - dodgeCount * 0.06);
    button.style.transform = `scale(${scale})`;
    lastX = x;
    lastY = y;
  };
  const dodgeBurst = (event?: Event): void => {
    if (burstActive || answered) return;
    burstActive = true;
    move(event);
    window.setTimeout(() => move(), 120);
    window.setTimeout(() => move(), 240);
    window.setTimeout(() => { burstActive = false; }, 380);
  };
  button.addEventListener("pointerenter", dodgeBurst);
  button.addEventListener("pointerdown", dodgeBurst);
  button.addEventListener("focus", dodgeBurst);
  button.addEventListener("touchstart", dodgeBurst, { passive: false });
  move(undefined, false);
}

function renderCelebration(): void {
  app.innerHTML = `<main class="celebration"><div class="confetti" aria-hidden="true"></div><div class="celebration-inner"><p class="eyebrow">The easiest answer</p><div class="couple-seal" aria-hidden="true"><span>${HUSBAND_NAME[0]}</span><b>♡</b><span>${WIFE_NAME[0]}</span></div><h1>Forever it is, Samina.</h1><p class="closing-message">${CLOSING_MESSAGE}</p><p class="signature">With all my love,<br><strong>${HUSBAND_NAME}</strong></p><button class="next-surprise" type="button">One more surprise<span aria-hidden="true">→</span></button><button class="restart" type="button">${RESTART_LABEL}<span aria-hidden="true">↻</span></button><p class="quiet-note">our little forever, ${HUSBAND_NAME} &amp; ${WIFE_NAME}</p></div><div class="live-region" aria-live="polite">You chose forever. ${CLOSING_MESSAGE} Love, ${HUSBAND_NAME}.</div></main>`;
  app.querySelector<HTMLButtonElement>(".next-surprise")!.addEventListener("click", renderUniverse);
  app.querySelector<HTMLButtonElement>(".restart")!.addEventListener("click", () => { window.clearTimeout(reactionTimer); currentIndex = 0; renderQuestion(); });
}

function renderUniverse(): void {
  const stars = Array.from({ length: 26 }, () => {
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const size = 2 + Math.random() * 4;
    const delay = (Math.random() * 2.5).toFixed(2);
    const duration = (2 + Math.random() * 3.5).toFixed(2);
    return `<span style="--x:${x}%; --y:${y}%; --size:${size}px; --delay:${delay}s; --duration:${duration}s"></span>`;
  }).join("");

  app.innerHTML = `
    <main class="universe-screen">
      <div class="star-field" aria-hidden="true">${stars}</div>
      <div class="universe-inner">
        <p class="eyebrow">For Samina</p>
        <h1>My little universe.</h1>
        <p class="universe-intro">I know I have been learning, and I still want to choose you with gentleness, patience, and honesty.</p>

        <div class="apology-stack" id="chapter-apology">
          ${APOLOGY_MESSAGES.map((message, index) => `
            <article class="apology-card" data-index="${index}">
              <span class="card-index">0${index + 1}</span>
              <p>${message}</p>
            </article>
          `).join("")}
        </div>

        <button class="chapter-btn" type="button" data-next="response">Continue ♡</button>

        <div class="chapter" id="chapter-response">
          <div class="response-strip">
            <button class="response-btn" type="button" data-response="talk">I’m ready to talk</button>
            <button class="response-btn" type="button" data-response="time">I need some time</button>
            <button class="response-btn" type="button" data-response="hug">Send me a hug</button>
          </div>

          <div id="response-panel" class="response-panel" aria-live="polite">
            I’m listening. I choose softness over pressure.
          </div>
        </div>

        <button class="chapter-btn" type="button" data-next="promise" style="display:none">Continue ♡</button>

        <div class="chapter" id="chapter-promise">
          <div class="promise-panel">
            <p class="panel-label">My promises</p>
            <div class="promise-grid">
              ${PROMISES.map((promise, index) => `
                <button class="promise-btn" type="button" data-index="${index}">${promise.title}</button>
              `).join("")}
            </div>
            <div id="promise-detail" class="promise-detail">Choose a promise and I’ll hold it close.</div>
          </div>
        </div>

        <button class="chapter-btn" type="button" data-next="final" style="display:none">Continue ♡</button>

        <div class="chapter" id="chapter-final">
          <div class="universe-actions">
            <button class="download-letter" type="button">Download my letter</button>
            <button class="restart universe-restart" type="button">${RESTART_LABEL}<span aria-hidden="true">↻</span></button>
          </div>
        </div>
      </div>
    </main>
  `;

  const cards = app.querySelectorAll<HTMLElement>(".apology-card");
  const responseChapter = app.querySelector<HTMLElement>("#chapter-response");
  const promiseChapter = app.querySelector<HTMLElement>("#chapter-promise");
  const finalChapter = app.querySelector<HTMLElement>("#chapter-final");
  const continueButtons = app.querySelectorAll<HTMLButtonElement>(".chapter-btn");

  const revealCards = (): void => {
    cards.forEach((card, index) => {
      window.setTimeout(() => {
        card.classList.add("is-visible");
      }, index * 500);
    });
  };

  const showChapter = (chapter: HTMLElement | null): void => {
    if (!chapter) return;
    chapter.classList.add("is-visible");
  };

  revealCards();

  continueButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const next = button.dataset.next;
      if (next === "response") {
        showChapter(responseChapter);
        button.style.display = "none";
        const nextButton = app.querySelector<HTMLButtonElement>('button[data-next="promise"]');
        if (nextButton) nextButton.style.display = "inline-flex";
      }
      if (next === "promise") {
        showChapter(promiseChapter);
        button.style.display = "none";
        const nextButton = app.querySelector<HTMLButtonElement>('button[data-next="final"]');
        if (nextButton) nextButton.style.display = "inline-flex";
      }
      if (next === "final") {
        showChapter(finalChapter);
        button.style.display = "none";
      }
    });
  });

  app.querySelectorAll<HTMLButtonElement>(".response-btn").forEach((button) => {
    const responseKey = button.dataset.response as "talk" | "time" | "hug" | undefined;
    const message = {
      talk: "I’m listening. I choose softness over pressure, and I want to understand you better.",
      time: "I hear you. Your peace matters more than my rush, and I will respect your pace.",
      hug: "I’m here. A hug is not a fix, but it is a start, and I am ready to meet you gently."
    }[responseKey ?? "talk"];

    button.addEventListener("click", () => {
      app.querySelector<HTMLElement>("#response-panel")!.textContent = message;
      app.querySelectorAll<HTMLButtonElement>(".response-btn").forEach((btn) => btn.classList.toggle("active", btn === button));
    });
  });

  app.querySelectorAll<HTMLButtonElement>(".promise-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const promise = PROMISES[Number(button.dataset.index)];
      app.querySelector<HTMLElement>("#promise-detail")!.textContent = promise.text;
      app.querySelectorAll<HTMLButtonElement>(".promise-btn").forEach((btn) => btn.classList.toggle("active", btn === button));
    });
  });

  app.querySelector<HTMLButtonElement>(".download-letter")?.addEventListener("click", () => {
    const letter = [
      "For Samina, from Erfan",
      "",
      "I am sorry for the times I made you feel unseen, rushed, or unheard.",
      "I know I still have a lot to learn, and I want to choose you with more patience, honesty, and care.",
      "I will listen before I answer.",
      "I will make room for your feelings.",
      "I will choose patience over pride.",
      "I will keep learning and doing better every day.",
      "I love you, and I want to be gentler with your heart and steadier with my love.",
      "No pressure. No performance. Just me, choosing you with more intention."
    ].join("\n");

    const blob = new Blob([letter], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "for-samina-from-erfan.txt";
    link.click();
    URL.revokeObjectURL(url);
  });

  app.querySelector<HTMLButtonElement>(".universe-restart")?.addEventListener("click", () => {
    window.clearTimeout(reactionTimer);
    currentIndex = 0;
    renderQuestion();
  });
}

renderQuestion();
