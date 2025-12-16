<script setup>
defineProps({
  message: String
});

const emit = defineEmits(['close']);
</script>

<template>
  <div class="modal-overlay refined-overlay" @click="emit('close')">
    <div class="success-modal-content" @click.stop>
      <div class="success-icon-container">
        <svg viewBox="0 0 24 24" class="checkmark-svg">
          <path
            d="M20 6L9 17l-5-5"
            stroke="white"
            stroke-width="3"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>

      <h2>Success!</h2>
      <p>{{ message }}</p>

      <button class="btn-primary return-btn" @click="emit('close')">
        Return to Notes
      </button>
    </div>
  </div>
</template>
