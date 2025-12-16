<script setup>
import { computed } from 'vue';

const props = defineProps({
  mode: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  form: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'save', 'file']);

const isView = computed(() => props.mode === 'view');

const handleFileChange = (e) => {
  emit('file', e);
};
</script>

<template>
  <div class="modal-overlay" @click="emit('close')">
    <div class="modal-content" @click.stop>
      <!-- Header -->
      <div class="modal-header">
        <h2>{{ title }}</h2>
        <button class="close-icon-btn" @click="emit('close')">&times;</button>
      </div>

      <!-- Upload -->
      <div class="form-group" v-if="!isView">
        <label>Upload Image (Optional)</label>
        <input type="file" accept="image/*" @change="handleFileChange" />
      </div>

      <!-- Image Preview -->
      <div class="preview-container" v-if="form.imagePreview">
        <p class="preview-label">Image Preview</p>
        <img :src="form.imagePreview" class="preview-img" />
      </div>

      <!-- Title -->
      <div class="form-group">
        <label>Title</label>
        <input
          v-model="form.title"
          :readonly="isView"
          :class="{ 'view-only-input': isView }"
        />
      </div>

      <!-- Content -->
      <div class="form-group">
        <label>Content</label>
        <textarea
          v-model="form.content"
          rows="6"
          :readonly="isView"
          :class="{ 'view-only-input': isView }"
        ></textarea>
      </div>

      <!-- Actions -->
      <div class="modal-actions">
        <button class="btn-ghost" @click="emit('close')">Cancel</button>

        <button
          v-if="!isView"
          class="btn-primary"
          @click="emit('save')"
        >
          {{ mode === 'edit' ? 'Update Note' : 'Save Note' }}
        </button>

        <button
          v-else
          class="btn-primary"
          @click="emit('close')"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>
