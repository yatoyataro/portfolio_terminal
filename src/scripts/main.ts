import { initClock } from "./clock";
import { initCpuFluctuation } from "./cpuFluctuation";
import { initScrollSpy } from "./scrollSpy";
import { initSkillReveal } from "./skillReveal";

const cleanups = [initScrollSpy(), initCpuFluctuation(), initClock(), initSkillReveal()];

window.addEventListener(
  "pagehide",
  () => {
    for (const cleanup of cleanups) cleanup();
  },
  { once: true }
);
