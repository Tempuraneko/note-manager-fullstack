import axios from 'axios';

export const BASE_URL = 'https://perfect-unity-production.up.railway.app';
export const API_URL = `${BASE_URL}/api/notes`;

export const fetchNotes = () => axios.get(API_URL);
export const addNote = (formData) => axios.post(API_URL, formData);
export const updateNote = (id, formData) =>
  axios.put(`${API_URL}/${id}`, formData);
export const deleteNote = (id) =>
  axios.delete(`${API_URL}/${id}`);
