import axios from 'axios';

const API_URL = 'http://localhost:3000/api/notes';

export const fetchNotes = () => axios.get(API_URL);
export const addNote = (formData) => axios.post(API_URL, formData);
export const updateNote = (id, formData) =>
  axios.put(`${API_URL}/${id}`, formData);
export const deleteNote = (id) =>
  axios.delete(`${API_URL}/${id}`);
