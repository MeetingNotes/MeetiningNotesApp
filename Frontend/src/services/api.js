import axios from 'axios'
const API_URL = 'http://localhost:3500/api';

export const loginUser = async (token) => {
  try {
    const response = await axios.post(`${API_URL}/user/login`, {}, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    if (error.response && !error.response.ok) {
      throw new Error('Login failed');
    }
    throw error;
  }
};

export const fetchTranscriptions = async (token, page, limit) => {
  const response = await axios.get('http://localhost:3500/api/transcriptions', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page,
      limit,
    },
  });

  const data = response.data.data.map(transcription => ({
    id: transcription.id,
    title: transcription.title,
    timestamp: transcription.timestamp,
    description: transcription.description,
    tasks: transcription.notes ? transcription.notes.split('\n') : []
  }));

  return { data };
};

export const uploadTranscription = async (token, payload) => {
  const response = await axios.post(
    'http://localhost:3500/api/transcription',
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const fetchTranscriptionById = async (token, transcriptionId) => {
  const response = await axios.get(`http://localhost:3500/api/transcription/${transcriptionId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};