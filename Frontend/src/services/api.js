import axios from 'axios'
const API_URL = process.env.REACT_APP_API_BASE_URL;//'http://meetingnotesapp-stack-api.eba-figufmfc.eu-west-1.elasticbeanstalk.com/api';
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
  const response = await axios.get(`${API_URL}/transcriptions`, {
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
    `${API_URL}/transcription`,
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
  const response = await axios.get(`${API_URL}/transcription/${transcriptionId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};