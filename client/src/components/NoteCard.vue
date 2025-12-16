<script setup>
import { computed } from 'vue';
import { BASE_URL } from '../services/noteService';

const props = defineProps({
  note: Object
});

defineEmits(['view', 'edit', 'delete']);

const imageUrl = computed(() => {
  if (props.note.image) {
    return `${BASE_URL}/uploads/${props.note.image}`;
  }
  return '/notebook.png'; // fallback image in public/
});
</script>

<template>
  <div class="note-card">
    <div class="card-body clickable" @click="$emit('view', note)">
      <img
        :src="imageUrl"
        class="card-icon"
        :class="{ 'uploaded-img': note.image }"
        alt="Note image"
      />
      <h3>{{ note.title }}</h3>
    </div>

    <div class="card-actions">
      <button class="icon-btn edit" @click.stop="$emit('edit', note)">
        ✏️ Edit
      </button>
      <button class="icon-btn delete" @click.stop="$emit('delete', note.id)">
        🗑️ Delete
      </button>
    </div>
  </div>
</template>
