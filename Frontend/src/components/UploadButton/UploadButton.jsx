import React, { useState } from 'react';
import styles from './UploadButton.module.css';
import { validateAndEncodeVttFile } from '../../services/fileService';
import { uploadTranscription } from '../../services/api';
import { fetchAuthSession } from 'aws-amplify/auth';

export const UploadButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAdd = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.vtt';
    fileInput.style.display = 'none';

    fileInput.addEventListener('change', async (event) => {
      const file = event.target.files[0];
      if (file) {
        const fileName = file.name;
        const fileExtension = fileName.split('.').pop();

        if (fileExtension === 'vtt') {
          try {
            setIsLoading(true);
            setMessage('');

            console.log('File selected:', file);

            const { base64Content } = await validateAndEncodeVttFile(file);
            console.log('File validated and encoded successfully');

            // Prepare the request payload
            const payload = {
              fileContent: base64Content,
              fileName: fileName,
            };

            const session = await fetchAuthSession();
            const authToken = session.tokens?.accessToken?.toString();

            // Make the POST request
            const response = await uploadTranscription(authToken, payload);

            setIsLoading(false);
            setMessage('Upload successful!');
            window.location.reload();
            console.log('Upload successful:', response);
          } catch (error) {
            setIsLoading(false);
            setMessage('Error uploading file.');
            console.error('Error processing the file:', error);
          }
        } else {
          alert('Please select a VTT file.');
        }
      }
    });

    fileInput.click();
  };

  return (
    <div className={styles.container}>
      <button className={styles.addbutton} onClick={handleAdd} disabled={isLoading}>
        {isLoading ? 'Uploading...' : 'Upload'}
      </button>
      {isLoading && <div className={styles.loader}></div>}
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};
