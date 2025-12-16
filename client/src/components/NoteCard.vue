<script setup>
defineProps(['note', 'image']);
defineEmits(['view', 'edit', 'delete']);
</script>

<template>
  <div class="note-card">
    <div class="card-body clickable" @click="$emit('view', note)">
      <img :src="image" class="card-icon" :class="{ 'uploaded-img': note.image }">
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
