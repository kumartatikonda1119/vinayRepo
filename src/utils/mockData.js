// ────────────────────────────────────────────────────────────────────────────
// Mock data for the UI boilerplate.
// Replace api/axios.js with a real axios client and delete this file when
// you wire up the backend.
// ────────────────────────────────────────────────────────────────────────────
import { format, subDays } from "date-fns";

const todayKey = () => format(new Date(), "yyyy-MM-dd");

export const mockUser = {
  _id: "u_alex",
  name: "Alex Rivera",
  email: "alex@example.com",
  avatar: "A",
  morningMotivation: true,
};

// In-memory habits — created/edited/deleted in the mock api so the UI feels live
let nextHabitId = 1;
const habit = (overrides) => ({
  _id: `h_${nextHabitId++}`,
  userId: mockUser._id,
  description: "",
  frequency: "daily",
  targetDays: 7,
  isArchived: false,
  order: nextHabitId,
  createdAt: subDays(new Date(), 89).toISOString(),
  updatedAt: subDays(new Date(), 89).toISOString(),
  ...overrides,
});

export const mockHabits = [
  habit({
    name: "Drink 2L of water",
    description: "Stay hydrated throughout the day.",
    category: "Health",
    color: "#0ea5e9",
    icon: "💧",
    order: 0,
    _streakProb: 0.95,
  }),
  habit({
    name: "Morning run",
    description: "30-minute run before breakfast.",
    category: "Fitness",
    targetDays: 5,
    color: "#ef4444",
    icon: "🏃",
    order: 1,
    _streakProb: 0.7,
    _pattern: "weekdays",
    _brokeAt: 20,
  }),
  habit({
    name: "Read 20 minutes",
    description: "Fiction or non-fiction, no phone.",
    category: "Learning",
    color: "#6366f1",
    icon: "📚",
    order: 2,
    _streakProb: 0.82,
  }),
  habit({
    name: "Meditate",
    description: "10 minutes of breath-focused meditation.",
    category: "Mindfulness",
    color: "#8b5cf6",
    icon: "🧘",
    order: 3,
    _streakProb: 0.6,
  }),
  habit({
    name: "Journal",
    description: "Write 3 things I'm grateful for.",
    category: "Mindfulness",
    targetDays: 5,
    color: "#ec4899",
    icon: "✍️",
    order: 4,
    _streakProb: 0.75,
    _pattern: "dropoff",
  }),
  habit({
    name: "Strength training",
    description: "Push/pull/legs split.",
    category: "Fitness",
    frequency: "weekly",
    targetDays: 3,
    color: "#f59e0b",
    icon: "💪",
    order: 5,
    _streakProb: 0.55,
    _pattern: "weekdays",
  }),
  habit({
    name: "Side project — 1hr",
    description: "Ship something small every day.",
    category: "Productivity",
    targetDays: 6,
    color: "#14b8a6",
    icon: "🎯",
    order: 6,
    _streakProb: 0.78,
  }),
];

// Generate deterministic-ish logs over the last 90 days
const buildLogs = () => {
  const logs = [];
  const today = new Date();
  for (const h of mockHabits) {
    for (let i = 0; i < 90; i++) {
      const d = subDays(today, i);
      const dow = d.getDay();
      const key = format(d, "yyyy-MM-dd");
      let p = h._streakProb;
      if (h._pattern === "weekdays" && (dow === 0 || dow === 6)) p *= 0.35;
      if (h._pattern === "dropoff" && i < 14) p *= 0.25;
      if (h._brokeAt && i >= h._brokeAt - 2 && i <= h._brokeAt + 2) continue;

      const seed = Math.sin(i * 9301 + h.name.length * 49297) * 233280;
      const rnd = seed - Math.floor(seed);
      if (rnd < p) {
        logs.push({
          _id: `l_${h._id}_${key}`,
          userId: mockUser._id,
          habitId: h._id,
          completedDate: key,
        });
      }
    }
  }
  // Make sure first 4 habits are checked off today for an interesting Today view
  const today_ = todayKey();
  for (let i = 0; i < 4; i++) {
    const h = mockHabits[i];
    if (!logs.some((l) => l.habitId === h._id && l.completedDate === today_)) {
      logs.push({
        _id: `l_${h._id}_${today_}`,
        userId: mockUser._id,
        habitId: h._id,
        completedDate: today_,
      });
    }
  }
  return logs;
};

export const mockLogs = buildLogs();

// ─── AI sample responses ──────────────────────────────────────────────────
export const mockAI = {
  weeklyReport: `Big week for hydration — you hit **Drink 2L of water** every single day, which is a real anchor habit forming.

Your **morning runs** slipped to 3/5 on weekdays — you're strongest Mon–Wed and tend to lose momentum mid-week. Reading and side-project work both held steady around 5/7 days.

One pattern worth noting: weekend completions across the board dropped about 30%. That's normal, but if you want to keep the streaks alive, try setting one tiny weekend version of each habit (a 5-minute walk instead of a full run, for example).

Overall this was a strong week. The fact that water is now automatic frees up willpower to focus on the trickier ones. Proud of you — keep going.`,
  recovery: `You had a great run with **Morning run** — 14 days at one point. Broken streaks are part of the journey, not the end of it.

**Day 1:** No pressure. Lace up your shoes and do a 10-minute walk-jog. The goal isn't pace, it's just showing up.

**Day 2:** 20 minutes at an easy pace. Pick a route you actually like.

**Day 3:** Back to your usual 30-minute run. By now the inertia has flipped.

Most streaks don't break because of motivation — they break because of friction. Try laying out your shoes the night before. Small setup, big payoff.`,
  morning: `Good morning, Alex! You're sitting on a **12-day water streak** — keep that going, it's the easiest win of your day. 💧 One small nudge: your **journal** habit needs a few minutes today to keep momentum. You've got this.`,
  chat: {
    default:
      "Hi — ask me anything about your habit data. I have your last 30 days loaded as context.",
    "Which day of the week am I most consistent?":
      "Looking at the past 30 days, **Monday** is your strongest day — averaging 5.2 completions per Monday. **Sunday** is the weakest at 2.8. The dip starts on Friday and bottoms out on Sunday.",
    "What is my best performing category?":
      "**Health** is your top category with 52 completions in the last 30 days, driven mostly by *Drink 2L water*. **Mindfulness** is the weakest at 28 completions — *Journal* in particular has slipped recently.",
    "Why do I keep failing my exercise habit?":
      "Your **Morning run** habit is at 19/30 in the last 30 days. The pattern is clear: weekdays are 80% strong, weekends drop to 35%. The breaks tend to start on Saturday and don't recover until Monday. A weekend-friendly alternative (like a short walk) might keep the streak alive.",
    "Why do I skip evening habits?":
      "Based on your pattern, I'd suggest anchoring your evening habits to something you already do — like brushing your teeth. Stack \"Journal 5 min\" right after it. You've completed morning habits 100% when they're anchored to coffee. Same principle!",
    "Suggest a morning habit":
      "Given your current schedule, I'd suggest a **4-7-8 breathing** habit — just 3 minutes, best at 9 PM. It's scientifically proven to lower cortisol fast and fits perfectly in your current gap between dinner and journaling.",
    "Improve my streak":
      "Your best strategy right now: **protect your water streak** (it's your longest at 13 days). For weaker habits, try the \"2-minute version\" on hard days — a 2-minute meditation still counts and keeps the streak alive. Consistency > perfection.",
    "Best sleep habits":
      "Top 3 sleep habits backed by research:\n\n1. **No screens 30 min before bed** — blue light suppresses melatonin\n2. **Same bedtime daily** — even on weekends, +/- 30 min\n3. **Cool room (65-68°F)** — your body needs to cool down to sleep\n\nYour *Journal* habit at night is actually great for sleep — writing worries down reduces sleep-onset anxiety by 40%.",
    "What's a good workout for beginners?":
      "Based on your current fitness habits, here's a beginner-friendly plan:\n\n**Week 1-2:** 20-min walks, 3x/week\n**Week 3-4:** Add bodyweight exercises (pushups, squats) for 15 min\n**Month 2:** Your current morning run at 30 min, 3x/week\n\nYou're already doing strength training — that's great. The key is not to increase more than 10% per week.",
    "How to stay motivated?":
      "Here's what your data tells me about your motivation:\n\n1. **You're strongest on Mondays** — use that energy to plan the week\n2. **Streaks are your fuel** — your completion rate jumps 40% once you hit a 5-day streak\n3. **Accountability helps** — your morning habits (visible to others) are 25% stronger than solo evening ones\n\nMy #1 tip: **Make it embarrassingly small** on low-motivation days. A 1-minute walk still counts.",
    "How often should I exercise?":
      "Based on your current fitness level and habit data, I'd recommend:\n\n- **3-4 days/week** of structured exercise (you're doing 3 now)\n- **Daily movement** of at least 20 minutes (walks count!)\n- **2 rest days** — you tend to burn out without them\n\nYour current Morning run + Strength training combo is solid. Just add a light walk on rest days.",
    "Beginner workout plan":
      "Here's a simple plan that fits your schedule:\n\n🏃 **Mon/Wed/Fri:** Morning run (you're already doing this!)\n💪 **Tue/Thu:** Strength training (already in your habits!)\n🚶 **Sat:** Long walk (I suggested this before)\n🧘 **Sun:** Yoga or stretching for recovery\n\nYou're honestly closer to a great routine than you think. The main gap is **active recovery** on rest days.",
    "How to stack habits":
      "**Habit stacking** is connecting a new habit to an existing one. Looking at your data:\n\n✅ Your morning chain works great: Coffee → Run → Water\n\n🔧 **Suggested stacks:**\n- After brushing teeth → Journal (2 min)\n- After lunch → Read 10 pages\n- After workout → Meditate (5 min)\n\nThe key: the trigger habit should already be automatic.",
    "Top 5 morning habits":
      "Based on research + your personal data, here are the top 5:\n\n1. 💧 **Hydrate first** — you already do this! It's your strongest habit\n2. 🏃 **Move for 10+ min** — your morning run covers this\n3. 🧘 **Breathe intentionally** — even 3 minutes of box breathing\n4. ✍️ **Set 3 daily intentions** — pairs well with your journal habit\n5. 📚 **Learn something new** — 10 min of reading while eating breakfast\n\nYou're already nailing #1 and #2. Adding #3 after your run could be a game changer.",
    "Best recovery tips":
      "When a streak breaks, here's the science-backed recovery plan:\n\n1. **Don't aim for perfection** — aim for \"never miss twice\"\n2. **Shrink the habit** — do a 2-minute version for 3 days\n3. **Remove friction** — lay out clothes, prep water bottle, set phone alarms\n4. **Forgive and restart** — guilt actually *reduces* future compliance\n\nYour **Morning run** streak broke at day 14 last time. That's still impressive. Most people quit at day 3.",
  },
  suggestions: [
    {
      name: "5-minute morning stretch",
      description: "Loosen up before the day starts.",
      frequency: "daily",
      category: "Health",
      icon: "🧘",
      reason:
        "Pairs naturally with your existing morning habits and takes almost no willpower.",
    },
    {
      name: "No screens for the first 30 minutes",
      description: "Start the morning offline.",
      frequency: "daily",
      category: "Mindfulness",
      icon: "😴",
      reason:
        "Helps your meditation habit stick and reduces decision fatigue early in the day.",
    },
    {
      name: "Weekly long walk",
      description: "60–90 minutes outdoors on Sunday.",
      frequency: "weekly",
      category: "Fitness",
      icon: "🚶",
      reason:
        "Gives you a low-friction movement habit on weekends when your run consistency drops.",
    },
  ],
};
