<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';

/* ================= CLOCK LOGIC ================= */
const hourAngle = ref(0);
const minuteAngle = ref(0);
const secondAngle = ref(0);

let clockTimer = null;

const updateClock = () => {
  const now = new Date();
  const seconds = now.getSeconds();
  const minutes = now.getMinutes();
  const hours = now.getHours();

  secondAngle.value = seconds * 6;
  minuteAngle.value = minutes * 6 + seconds * 0.1;
  hourAngle.value = (hours % 12) * 30 + minutes * 0.5;
};

/* ================= CALENDAR LOGIC ================= */
const now = new Date();
const year = ref(now.getFullYear());
const month = ref(now.getMonth());

const monthNames = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

const daysInMonth = computed(() =>
  new Date(year.value, month.value + 1, 0).getDate()
);

const firstDayOfMonth = computed(() =>
  new Date(year.value, month.value, 1).getDay()
);

const todayDate = now.getDate();
const todayMonth = now.getMonth();
const todayYear = now.getFullYear();

/* ================= LIFECYCLE ================= */
onMounted(() => {
  updateClock();
  clockTimer = setInterval(updateClock, 1000);
});

onUnmounted(() => {
  clearInterval(clockTimer);
});
</script>

<template>
  <div class="clock-wrapper">
    <!-- ===== ANALOG CLOCK (UNCHANGED) ===== -->
    <svg viewBox="0 0 100 100" class="svg-clock">
      <circle
        cx="50"
        cy="50"
        r="48"
        fill="white"
        stroke="#FAD4C8"
        stroke-width="4"
      />

      <circle cx="50" cy="50" r="3" fill="#2c3e50" />

      <!-- Hour hand -->
      <line
        x1="50"
        y1="50"
        x2="50"
        y2="28"
        stroke="#2c3e50"
        stroke-width="4"
        stroke-linecap="round"
        :style="{ transform: `rotate(${hourAngle}deg)`, transformOrigin: '50px 50px' }"
      />

      <!-- Minute hand -->
      <line
        x1="50"
        y1="50"
        x2="50"
        y2="20"
        stroke="#2c3e50"
        stroke-width="3"
        stroke-linecap="round"
        :style="{ transform: `rotate(${minuteAngle}deg)`, transformOrigin: '50px 50px' }"
      />

      <!-- Second hand -->
      <line
        x1="50"
        y1="50"
        x2="50"
        y2="15"
        stroke="#FF5252"
        stroke-width="2"
        stroke-linecap="round"
        :style="{ transform: `rotate(${secondAngle}deg)`, transformOrigin: '50px 50px' }"
      />
    </svg>

    <!-- ===== CALENDAR (ADDED BELOW CLOCK) ===== -->
    <div class="calendar">
      <div class="calendar-header">
        {{ monthNames[month] }} {{ year }}
      </div>

      <div class="calendar-grid">
        <div
          v-for="d in ['Su','Mo','Tu','We','Th','Fr','Sa']"
          :key="d"
          class="calendar-day"
        >
          {{ d }}
        </div>

        <div
          v-for="n in firstDayOfMonth"
          :key="'empty-' + n"
          class="calendar-cell empty"
        ></div>

        <div
          v-for="day in daysInMonth"
          :key="day"
          class="calendar-cell"
          :class="{
            today:
              day === todayDate &&
              month === todayMonth &&
              year === todayYear
          }"
        >
          {{ day }}
        </div>
      </div>
    </div>
  </div>
</template>

