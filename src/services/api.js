import axios from "axios";

const API_BASE_URL = "https://ctr-predictor-and-analyzer-1.onrender.com" 

export const api = axios.create({
    baseURL: API_BASE_URL,
});


// ---------------Endpoints--------------

export const predictTextCTR = (text) => api.post('/predict-text', { text });
export const predictImageCTR = (formData) => api.post('/predict-image', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});