<template>
  <section class="hero">
    <p class="hero__meta">{{ t.hero.meta }}</p>
    <h1 class="hero__title">Pikto</h1>
    <p class="hero__lead">{{ t.hero.lead }}</p>
    <TerminalPrompt path="~/pikto" command="compress assets --to webp,avif" />

    <div
      class="mascot"
      :class="{ 'mascot--chewing': isScrolling && scrollY > 5 }"
      :style="mascotStyle"
      aria-hidden="true"
    >
      <svg class="mascot__svg" xmlns="http://www.w3.org/2000/svg" style="--beaver-skin-light:#D5925F;--beaver-skin-dark:#A66637;--beaver-features:#512D15;--beaver-features-dark:#351C0C;--harness-color-light:#0D9488;--harness-color-dark:#0F766E;--harness-buckle:#1F2937;--harness-buckle-accent:#9CA3AF;--card-sky-start:#BAE6FD;--card-sky-end:#7DD3FC;--card-mountain-light:#4ADE80;--card-mountain-dark:#16A34A;--card-sun:#F59E0B;--pixel-color-1:#4ADE80;--pixel-color-2:#22C55E;--pixel-color-3:#16A34A" viewBox="0 0 600 800">
        <defs>
          <linearGradient id="body-gradient" x1="0%" x2="0%" y1="0%" y2="100%">
            <stop class="skin-gradient-start" offset="0%" stop-color="#e8a773" />
            <stop class="skin-gradient-end" offset="100%" stop-color="#a66637" />
          </linearGradient>
          <linearGradient id="harness-gradient" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stop-color="var(--harness-color-light)" />
            <stop offset="100%" stop-color="var(--harness-color-dark)" />
          </linearGradient>
          <linearGradient id="sky-gradient" x1="0%" x2="0%" y1="0%" y2="100%">
            <stop offset="0%" style="stop-color:var(--card-sky-start)" />
            <stop offset="100%" style="stop-color:var(--card-sky-end)" />
          </linearGradient>
          <linearGradient id="tail-gradient" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stop-color="#5c3b24" />
            <stop offset="100%" stop-color="#382010" />
          </linearGradient>
          <clipPath id="tail-clip">
            <path d="M360 400c40-20 110-10 150 30s30 110-30 140-110-20-130-70Z" />
          </clipPath>
          <clipPath id="card-clip">
            <path d="M218 328h164v106h-13v10h-15v-15h-15v10h-15v-15h-15v10h-15v15h-15v-10h-15v-10h-15v10h-15v-15h-15v10Z" />
          </clipPath>
          <filter id="soft-shadow" width="120%" height="120%" x="-10%" y="-10%">
            <feDropShadow dx="0" dy="8" flood-opacity=".15" stdDeviation="10" />
          </filter>
        </defs>
        <ellipse cx="300" cy="590" filter="blur(8px)" opacity=".12" rx="140" ry="25" />
        <g id="tail">
          <path id="tail-shape" fill="url(#tail-gradient)" d="M360 400c40-20 110-10 150 30s30 110-30 140-110-20-130-70Z" filter="url(#soft-shadow)" />
          <g clip-path="url(#tail-clip)">
            <path fill="none" stroke="var(--beaver-features-dark)" stroke-linecap="round" stroke-width="4.5" d="m320 380 200 200M350 360l200 200M380 340l200 200M410 320l200 200m-290 40 200-200M350 580l200-200M380 600l200-200M290 540l200-200" opacity=".45" />
          </g>
        </g>
        <g id="hanging-rig" filter="url(#soft-shadow)">
          <path stroke="#9ca3af" stroke-linecap="round" stroke-width="5" d="M300 0v70" />
          <circle cx="300" cy="80" r="16" fill="none" stroke="#9ca3af" stroke-width="7" />
          <path stroke="var(--harness-color-light)" stroke-linecap="round" stroke-width="16" d="m288 88-66 122M312 88l66 122" />
        </g>
        <g id="beaver-body-group">
          <circle cx="218" cy="180" r="24" class="beaver-feature-fill" filter="url(#soft-shadow)" />
          <circle cx="218" cy="180" r="14" fill="#8c4e2d" />
          <circle cx="382" cy="180" r="24" class="beaver-feature-fill" filter="url(#soft-shadow)" />
          <circle cx="382" cy="180" r="14" fill="#8c4e2d" />
          <path id="body-path" d="M300 155c75 0 115 50 125 140s-15 195-125 195-135-105-125-195 50-140 125-140" filter="url(#soft-shadow)" style="fill:url(#body-gradient)" />
        </g>
        <g id="chest-harness">
          <path fill="none" stroke="url(#harness-gradient)" stroke-linecap="round" stroke-width="18" d="M183 380c47 40 187 40 234 0" />
          <path fill="none" stroke="url(#harness-gradient)" stroke-linecap="round" stroke-width="18" d="M222 210c13 70 48 160 118 182" />
          <path fill="none" stroke="url(#harness-gradient)" stroke-linecap="round" stroke-width="18" d="M378 210c-13 70-38 125-68 150" />
          <g transform="rotate(15 -1109.789 1401.81)">
            <rect width="28" height="28" x="-14" y="-14" rx="6" style="fill:var(--harness-buckle)" />
            <rect width="18" height="18" x="-9" y="-9" fill="none" stroke="var(--harness-buckle-accent)" stroke-width="4" rx="3" />
            <path stroke="var(--harness-buckle-accent)" stroke-width="4" d="M-12 0h24" />
          </g>
        </g>
        <g id="face">
          <circle cx="265" cy="245" r="7" fill="#1a0d07" />
          <circle cx="267" cy="243" r="2.2" fill="#fff" />
          <circle cx="335" cy="245" r="7" fill="#1a0d07" />
          <circle cx="337" cy="243" r="2.2" fill="#fff" />
          <g opacity=".7">
            <path stroke="var(--beaver-features)" stroke-linecap="round" stroke-width="4.5" d="m235 268-25 2m20 10-25 5m30 7-20 6M365 268l25 2m-20 10 25 5m-30 7 20 6" />
          </g>
          <g class="beaver-mouth">
            <path fill="#3a0c0c" stroke="var(--beaver-features-dark)" stroke-width="2.5" d="M276 276s6 30 24 30 24-30 24-30-24 6-48 0Z" />
            <rect width="9" height="12" x="290" y="278" fill="#fff" rx="2" />
            <rect width="9" height="12" x="301" y="278" fill="#fff" rx="2" />
            <path fill="#fda4af" d="M288 298c4-6 20-6 24 0-4 7-20 7-24 0" />
          </g>
          <path fill="#1f0d04" d="M286 256c0-9 28-9 28 0s-14 18-14 18-14-9-14-18" />
          <path fill="none" stroke="#fff" stroke-linecap="round" stroke-width="2" d="M292 252c0-2 6-2 8 0" opacity=".3" />
        </g>
        <g id="image-card" filter="url(#soft-shadow)">
          <path fill="#fff" d="M210 320h180v120h-15v10h-15v-15h-15v10h-15v-15h-15v10h-15v15h-15v-10h-15v-10h-15v10h-15v-15h-15v10h-15Z" />
          <g clip-path="url(#card-clip)">
            <path fill="url(#sky-gradient)" d="M218 328h164v130H218z" />
            <circle cx="340" cy="360" r="16" style="fill:var(--card-sun)" />
            <path d="m280 460 55-90 47 90z" style="fill:var(--card-mountain-dark)" />
            <path d="m218 460 52-65 52 65z" style="fill:var(--card-mountain-light)" />
          </g>
        </g>
        <g id="paws">
          <g id="left-paw" filter="url(#soft-shadow)">
            <rect width="22" height="13" x="194" y="335" class="beaver-feature-fill" rx="6.5" transform="rotate(-12 205 341.5)" />
            <rect width="25" height="13" x="188" y="348" class="beaver-feature-fill" rx="6.5" />
            <rect width="22" height="13" x="194" y="361" class="beaver-feature-fill" rx="6.5" transform="rotate(12 205 367.5)" />
          </g>
          <g id="right-paw" filter="url(#soft-shadow)">
            <rect width="22" height="13" x="384" y="335" class="beaver-feature-fill" rx="6.5" transform="rotate(12 395 341.5)" />
            <rect width="25" height="13" x="387" y="348" class="beaver-feature-fill" rx="6.5" />
            <rect width="22" height="13" x="384" y="361" class="beaver-feature-fill" rx="6.5" transform="rotate(-12 395 367.5)" />
          </g>
          <g id="left-foot" filter="url(#soft-shadow)">
            <ellipse cx="235" cy="480" class="beaver-feature-fill" rx="18" ry="24" transform="rotate(-15 235 480)" />
            <circle cx="222" cy="464" r="5" class="beaver-feature-fill" />
            <circle cx="234" cy="460" r="5" class="beaver-feature-fill" />
            <circle cx="246" cy="464" r="5" class="beaver-feature-fill" />
          </g>
          <g id="right-foot" filter="url(#soft-shadow)">
            <ellipse cx="365" cy="480" class="beaver-feature-fill" rx="18" ry="24" transform="rotate(15 365 480)" />
            <circle cx="354" cy="464" r="5" class="beaver-feature-fill" />
            <circle cx="366" cy="460" r="5" class="beaver-feature-fill" />
            <circle cx="378" cy="464" r="5" class="beaver-feature-fill" />
          </g>
        </g>
        <g id="falling-pixels">
          <path d="m231.133 454.05 11.818 2.083-2.084 11.818-11.818-2.084z" class="pixel-fill-1" />
          <path d="m249.583 460.455 9.962-.872.872 9.962-9.962.872z" class="pixel-fill-2" />
          <path d="m282.05 468.427 13.523 3.623-3.623 13.523-13.523-3.623z" class="pixel-fill-3" />
          <path d="m321 462.515 8.485 8.485-8.485 8.485-8.485-8.485z" class="pixel-fill-1" />
          <path d="m348.591 457.012 9.397-3.42 3.42 9.396-9.396 3.42z" class="pixel-fill-2" />
          <path d="m370.893 464.223 11.884 1.67-1.67 11.884-11.884-1.67z" class="pixel-fill-3" />
          <path d="m222.582 488.355 9.063 4.227-4.227 9.063-9.063-4.227z" class="pixel-fill-2" opacity=".9" />
          <path d="m243.652 511.757 11.59-3.105 3.106 11.59-11.59 3.106z" class="pixel-fill-3" opacity=".8" />
          <path d="m278.17 493.17 8.66 5-5 8.66-8.66-5z" class="pixel-fill-1" opacity=".85" />
          <path d="m300.637 524.417 13.946 1.22-1.22 13.946-13.946-1.22z" class="pixel-fill-2" opacity=".75" />
          <path d="m332.956 504.384 7.66-6.428 6.428 7.66-7.66 6.428z" class="pixel-fill-3" opacity=".9" />
          <path d="m361.379 518.884 11.737 2.495-2.495 11.737-11.737-2.495z" class="pixel-fill-1" opacity=".8" />
          <path d="m235.364 549.667 7.97.697-.698 7.97-7.97-.698z" class="pixel-fill-1" opacity=".6" />
          <path d="m258.17 583.17 8.66-5 5 8.66-8.66 5z" class="pixel-fill-3" opacity=".5" />
          <path d="m291.172 564.101 7.727 2.07-2.07 7.728-7.728-2.07z" class="pixel-fill-2" opacity=".55" />
          <path d="m330.26 587.547 9.193 7.713-7.713 9.193-9.193-7.713z" class="pixel-fill-1" opacity=".4" />
          <path d="m349.482 560.596 7.922-1.114 1.114 7.922-7.922 1.114z" class="pixel-fill-3" opacity=".6" />
          <path d="m251.432 638.96 7.608 2.472-2.472 7.608-7.608-2.472z" class="pixel-fill-2" opacity=".3" />
          <path d="m279.75 665.273 5.977-.523.523 5.977-5.977.523z" class="pixel-fill-1" opacity=".2" />
          <path d="m313.018 648.43 6.553 4.588-4.589 6.553-6.553-4.589z" class="pixel-fill-3" opacity=".25" />
          <path d="m340.567 669.525 5.908 1.042-1.042 5.908-5.908-1.042z" class="pixel-fill-2" opacity=".15" />
        </g>
      </svg>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, computed } from 'vue';
  import { t } from '@/app/i18n';
  import TerminalPrompt from './TerminalPrompt.vue';

  const scrollY = ref(0);
  const isScrolling = ref(false);
  let scrollTimeout: number | null = null;

  const handleScroll = () => {
    scrollY.value = window.scrollY;
    isScrolling.value = true;

    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }

    scrollTimeout = window.setTimeout(() => {
      isScrolling.value = false;
    }, 150);
  };

  onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
  });

  const mascotStyle = computed(() => {
    // Коэффициент 1.35 заставляет маскота двигаться чуть быстрее скролла (эффект параллакса)
    const offset = scrollY.value * 1.35;
    return {
      transform: `translateY(-${offset}px)`,
    };
  });
</script>

<style>
  .hero {
    position: relative;
    display: grid;
    gap: var(--space-2);
    padding: var(--space-5) 0 var(--space-4);
    border-bottom: 1px solid var(--divider-color);
  }

  .hero__meta {
    margin: 0;
    color: var(--text-secondary-color);
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .hero__title {
    margin: 0;
    font-family: 'Dela Gothic One', sans-serif;
    font-size: clamp(3.5rem, 9vw, 7rem);
    line-height: 0.92;
    letter-spacing: -0.01em;
    z-index: 1; /* Чтобы заголовок не перекрывался веревкой сзади */
  }

  .hero__lead {
    max-width: 42rem;
    margin: 0;
    color: var(--text-secondary-color);
    font-size: 1.05rem;
    z-index: 1;
  }

  /* Стили маскота */
  .mascot {
    position: absolute;
    right: 0;
    top: 0;
    width: 130px;
    height: auto;
    pointer-events: none;
    z-index: 0; /* Висит за текстом Hero */
    transform-origin: top center;
    will-change: transform;
    transition: transform 0.15s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  @media (min-width: 640px) {
    .mascot {
      width: 170px;
      right: 16px;
    }
  }

  @media (min-width: 1024px) {
    .mascot {
      width: 220px;
      right: 48px;
    }
  }

  .mascot__svg {
    display: block;
    width: 100%;
    height: auto;
    animation: mascot-slide-down 1.2s cubic-bezier(0.25, 1, 0.5, 1) forwards;
  }

  /* Анимация плавного спуска при загрузке */
  @keyframes mascot-slide-down {
    0% {
      transform: translateY(-300px);
      opacity: 0;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }

  /* Анимация жевания рта бобра при скролле */
  .mascot--chewing .beaver-mouth {
    animation: beaver-chew 0.15s infinite ease-in-out;
    transform-origin: 300px 270px;
  }

  @keyframes beaver-chew {
    0%, 100% {
      transform: translateY(0) scaleY(1);
    }
    50% {
      transform: translateY(4px) scaleY(0.85);
    }
  }

  /* Вибрация и всасывание пикселей при скролле (жевании) */
  .mascot--chewing .pixel-fill-1 {
    animation: pixel-shake 0.12s infinite linear, pixel-float-up-1 0.4s infinite linear;
    transform-origin: center;
  }

  .mascot--chewing .pixel-fill-2 {
    animation: pixel-shake 0.1s infinite linear, pixel-float-up-2 0.5s infinite linear;
    transform-origin: center;
  }

  .mascot--chewing .pixel-fill-3 {
    animation: pixel-shake 0.14s infinite linear, pixel-float-up-3 0.6s infinite linear;
    transform-origin: center;
  }

  @keyframes pixel-shake {
    0%, 100% {
      transform: translate(0, 0);
    }
    25% {
      transform: translate(-3px, 1px);
    }
    50% {
      transform: translate(1px, -3px);
    }
    75% {
      transform: translate(2px, 2px);
    }
  }

  @keyframes pixel-float-up-1 {
    0% {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
    100% {
      transform: translateY(-80px) scale(0.6);
      opacity: 0;
    }
  }

  @keyframes pixel-float-up-2 {
    0% {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
    100% {
      transform: translateY(-110px) scale(0.5);
      opacity: 0;
    }
  }

  @keyframes pixel-float-up-3 {
    0% {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
    100% {
      transform: translateY(-90px) scale(0.7);
      opacity: 0;
    }
  }

  /* Стили для заливки частей SVG */
  .beaver-feature-fill {
    fill: var(--beaver-features);
  }

  .pixel-fill-1 {
    fill: var(--pixel-color-1);
  }

  .pixel-fill-2 {
    fill: var(--pixel-color-2);
  }

  .pixel-fill-3 {
    fill: var(--pixel-color-3);
  }
</style>
