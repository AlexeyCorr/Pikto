<template>
  <section class="hero">
    <p class="hero__meta">{{ t.hero.meta }}</p>
    <h1 class="hero__title">Pikto</h1>
    <p class="hero__lead">{{ t.hero.lead }}</p>
    <TerminalPrompt path="~/pikto" command="compress assets --to webp,avif" />

    <Teleport to="body" :disabled="!hasProcessed">
      <Transition name="mascot-presence">
        <div
          v-if="!hasProcessed || processing"
          :key="hasProcessed ? 'processing' : 'intro'"
          class="mascot"
          :class="{ 'mascot--chewing': processing || (isScrolling && scrollY > 5), 'mascot--processing': hasProcessed }"
          :style="hasProcessed ? undefined : mascotStyle"
          aria-hidden="true"
        >
          <svg class="mascot__svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" fill="none">
            <path d="M258 0v139" stroke="#A6B8B1" stroke-width="4" stroke-linecap="round" />
            <g class="mascot__tail">
              <path d="M262 291c28-2 69 24 86 53 17 28 5 58-20 67-27 10-58-9-76-33-18-25-23-55-12-71Z" fill="#69463E" />
              <path d="m266 317 63 61m-73-39 55 53m-23-77 47 46m-76 3 45-45m-28 62 45-45m-25 62 39-39" stroke="#503730" stroke-width="4" stroke-linecap="round" />
            </g>
            <!-- The raised arm joins the shoulder behind the head; the rope passes through the grip. -->
            <path d="M224 247c18-35 13-71 17-101 1-14 7-23 17-22 13 2 15 12 12 27-4 36 6 74-17 106Z" fill="#A36C53" />
            <path d="M254 111c-11-2-21 3-22 10-1 4 1 7 5 9-4 3-4 8-1 12 4 5 12 7 22 7 12 0 21-7 22-17 1-9-9-18-26-21Z" fill="#A36C53" />
            <path d="M237 123q8 3 17 2m-16 9q8 3 16 1" stroke="#754C3E" stroke-width="2.5" stroke-linecap="round" />
            <path d="M176 216c39-25 89-8 107 32 19 41 19 82-5 109-26 30-82 25-116 2-34-24-42-61-29-94 8-21 24-37 43-49Z" fill="#A36C53" />
            <path d="M183 277c25-18 66-6 75 22 10 29-6 52-33 56-29 4-56-16-58-39-2-15 3-30 16-39Z" fill="#B77F5F" />
            <path d="M261 354c19 6 25 27 15 35-12 9-32-10-36-25m-56-6c6 20-2 41-15 38-14-3-16-27-10-42" fill="#754C3E" />
            <g transform="rotate(-16 165 220)">
              <circle cx="111" cy="166" r="18" fill="#A36C53" />
              <circle cx="111" cy="166" r="8" fill="#754C3E" />
              <circle cx="221" cy="161" r="18" fill="#A36C53" />
              <circle cx="221" cy="161" r="8" fill="#754C3E" />
              <path d="M164 153c-46 0-79 26-83 65-6 42 18 69 76 70 58 2 91-20 91-58 0-46-32-77-84-77Z" fill="#B77F5F" />
              <path d="M163 227c-19-21-48-15-53 9-6 26 22 43 54 43 35 0 60-18 55-42-5-24-36-31-56-10Z" fill="#DFB58D" />
              <ellipse cx="135" cy="211" rx="8.5" ry="12" fill="#352B29" />
              <ellipse cx="194" cy="207" rx="8.5" ry="12" fill="#352B29" />
              <circle cx="137" cy="207" r="2.8" fill="#FFF4DE" />
              <circle cx="196" cy="203" r="2.8" fill="#FFF4DE" />
              <path d="M149 231c-2-10 29-12 29-3 0 7-8 14-13 14-6 0-15-5-16-11Z" fill="#352B29" />
            </g>
            <path d="M143 278c-17-8-33-1-44 12l-5 20c19 11 39-1 49-13Z" fill="#A36C53" />
            <g transform="rotate(10 155 306)">
              <!-- A stepped bite sits directly under the two incisors. -->
              <path d="M106 265h39v13h14v-8h15v10h14v-15h19a9 9 0 0 1 9 9v74a9 9 0 0 1-9 9H106a9 9 0 0 1-9-9v-74a9 9 0 0 1 9-9Z" fill="#FFF4DE" />
              <path d="M106 285h101v63H106Z" fill="#A8D5CA" />
              <circle cx="188" cy="299" r="10" fill="#EDB762" />
              <path d="m106 348 31-38 33 38Z" fill="#62B294" />
              <path d="m146 348 32-49 29 49Z" fill="#28866E" />
            </g>
            <g transform="rotate(-16 165 220)">
              <g class="mascot__mouth">
                <path d="M145 250q21 12 42-2c-2 20-10 32-21 32-10 0-18-13-21-30Z" fill="#59382F" />
                <path d="M152 255q6 3 12 2v19q-6 2-12 0Zm16 2q6 0 12-3v21q-6 3-12 2Z" fill="#FFF4DE" />
                <path d="M145 250q21 12 42-2" stroke="#694236" stroke-width="2.5" stroke-linecap="round" />
              </g>
            </g>
            <path d="M102 289c-11-5-21-3-24 6-5 13 6 25 18 28 10 3 18-1 19-8 0-5-5-9-12-11 7 0 12-3 11-8-1-4-7-7-12-7Z" fill="#A36C53" />
            <path d="M85 301q7 8 17 7" stroke="#754C3E" stroke-width="2.5" stroke-linecap="round" />
            <g fill="#4ADE80">
              <path class="mascot__pixel" d="m112 358 12 4-4 12-12-4Z" />
              <path class="mascot__pixel" d="m142 370 10-3 3 10-10 3Z" fill="#22C55E" />
              <path class="mascot__pixel" d="m185 358 13 3-3 13-13-3Z" />
              <path class="mascot__pixel" d="m215 375 9-4 4 9-9 4Z" fill="#22C55E" />
              <path class="mascot__pixel" d="m122 394 9 3-3 9-9-3Z" />
              <path class="mascot__pixel" d="m163 400 11-2 2 11-11 2Z" fill="#22C55E" />
              <path class="mascot__pixel" d="m200 415 9 4-4 9-9-4Z" />
              <path class="mascot__pixel" d="m143 432 8-3 3 8-8 3Z" fill="#22C55E" />
              <path class="mascot__pixel" d="m179 448 7 2-2 7-7-2Z" />
            </g>
          </svg>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
  import { t } from '@/app/i18n';
  import TerminalPrompt from './TerminalPrompt.vue';

  const props = defineProps<{ processing: boolean }>();
  const hasProcessed = ref(false);

  watch(() => props.processing, (processing) => {
    if (processing) {
      hasProcessed.value = true;
    }
  }, { immediate: true });

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
    padding-right: 130px;
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

  .mascot--processing {
    position: fixed;
    top: 0;
    right: 12px;
    z-index: 20;
  }

  .mascot-presence-leave-active {
    transition: transform 0.45s ease-in, opacity 0.45s ease-in;
  }

  .mascot-presence-leave-to {
    transform: translateY(-110%);
    opacity: 0;
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

  .mascot--chewing .mascot__mouth {
    animation: mascot-chew 0.24s infinite ease-in-out;
    transform-origin: 166px 246px;
  }

  @keyframes mascot-chew {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(2px) scaleY(0.92);
    }
  }

  .mascot--chewing .mascot__pixel {
    animation: mascot-crumb-fall 0.85s infinite linear;
    transform-box: fill-box;
    transform-origin: center;
  }

  .mascot--chewing .mascot__pixel:nth-child(2n) {
    animation-delay: -0.2s;
  }

  .mascot--chewing .mascot__pixel:nth-child(3n) {
    animation-delay: -0.55s;
  }

  @keyframes mascot-crumb-fall {
    0% {
      transform: translateY(-28px) rotate(0);
      opacity: 0;
    }
    15%, 55% {
      opacity: 1;
    }
    100% {
      transform: translate(10px, 58px) rotate(70deg);
      opacity: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .mascot {
      transition: none;
    }

    .mascot__svg,
    .mascot--chewing .mascot__mouth,
    .mascot--chewing .mascot__pixel {
      animation: none;
    }
  }
</style>
