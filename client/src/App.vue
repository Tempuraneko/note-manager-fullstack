<script setup>
import { ref, reactive, computed, onMounted } from 'vue';

/* Components */
import AnalogClock from './components/AnalogClock.vue';
import NoteCard from './components/NoteCard.vue';
import NoteModal from './components/NoteModal.vue';
import SuccessModal from './components/SuccessModal.vue';

/* Services */
import {
  fetchNotes,
  addNote,
  updateNote,
  deleteNote
} from './services/noteService';

/* Constants */
const SERVER_URL = 'http://localhost:3000';

/* State */
const notes = ref([]);
const showModal = ref(false);
const showSuccessModal = ref(false);
const modalMode = ref('add');
const successMessage = ref('');

/* Form State */
const form = reactive({
  id: null,
  title: '',
  content: '',
  imageFile: null,
  imagePreview: null
});

/* Computed */
const modalTitle = computed(() => {
  if (modalMode.value === 'add') return 'Add New Note';
  if (modalMode.value === 'edit') return 'Edit Note';
  return 'View Note';
});

/* Helpers */
const getNoteImage = (note) =>
  note.image
    ? `${SERVER_URL}/uploads/${note.image}`
    : '/notebook.png';

/* API Actions */
const loadNotes = async () => {
  const res = await fetchNotes();
  notes.value = res.data.data.reverse();
};

const saveNote = async () => {
  if (modalMode.value === 'view') return;

  const formData = new FormData();
  formData.append('title', form.title);
  formData.append('content', form.content);

  if (form.imageFile) {
    formData.append('image', form.imageFile);
  }

  if (modalMode.value === 'edit') {
    await updateNote(form.id, formData);
    successMessage.value = 'Note updated successfully!';
  } else {
    await addNote(formData);
    successMessage.value = 'Note added successfully!';
  }

  closeModal();
  showSuccessModal.value = true;
  loadNotes();
};

const confirmDelete = async (id) => {
  if (!confirm('Are you sure you want to delete this note?')) return;
  await deleteNote(id);
  successMessage.value = 'Note deleted successfully!';
  showSuccessModal.value = true;
  loadNotes();
};

/* Modal Controls */
const openAddModal = () => {
  modalMode.value = 'add';
  resetForm();
  showModal.value = true;
};

const openEditModal = (note) => {
  modalMode.value = 'edit';
  populateForm(note);
  showModal.value = true;
};

const openViewModal = (note) => {
  modalMode.value = 'view';
  populateForm(note);
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  resetForm();
};

const closeSuccessModal = () => {
  showSuccessModal.value = false;
};

/* Form Helpers */
const populateForm = (note) => {
  form.id = note.id;
  form.title = note.title;
  form.content = note.content;
  form.imageFile = null;
  form.imagePreview = note.image
    ? `${SERVER_URL}/uploads/${note.image}`
    : null;
};

const resetForm = () => {
  form.id = null;
  form.title = '';
  form.content = '';
  form.imageFile = null;
  form.imagePreview = null;
};

const onFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  form.imageFile = file;
  form.imagePreview = URL.createObjectURL(file);
};

/* Lifecycle */
onMounted(loadNotes);
</script>

<template>
  <div class="app-container">
    <!-- HEADER -->
    <header class="main-header">
      <div class="header-brand">
        <img src="/notebook.png" class="header-img" />
        <h1>Note Manager</h1>
      </div>
    </header>

    <div class="content-wrapper">
      <!-- SIDEBAR -->
      <aside class="sidebar">
        <AnalogClock />
      </aside>

      <!-- MAIN -->
      <main class="main-content">
        <div class="notes-header">
          <h2>Notes</h2>
          <button class="add-btn-modern" @click="openAddModal">
            Add Note <span>+</span>
          </button>
        </div>

        <TransitionGroup name="list" tag="div" class="notes-grid">
  <NoteCard
    v-for="note in notes"
    :key="note.id"
    :note="note"
    :image="getNoteImage(note)"
    @view="openViewModal"
    @edit="openEditModal"
    @delete="confirmDelete"
  />
</TransitionGroup>
      </main>
    </div>

    <!-- NOTE MODAL -->
    <Transition name="modal-fade">
  <NoteModal
    v-if="showModal"
    :mode="modalMode"
    :title="modalTitle"
    :form="form"
    @close="closeModal"
    @save="saveNote"
    @file="onFileChange"
  />
</Transition>

    <!-- SUCCESS MODAL -->
    <Transition name="modal-fade">
  <SuccessModal
    v-if="showSuccessModal"
    :message="successMessage"
    @close="closeSuccessModal"
  />
</Transition>
  </div>
</template>
