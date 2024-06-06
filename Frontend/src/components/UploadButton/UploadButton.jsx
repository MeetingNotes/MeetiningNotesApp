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

    fileInput.addEventListener('change', async (event) => {
      const file = event.target.files[0];
      if (file) {
        const fileName = file.name;
        const fileExtension = fileName.split('.').pop();
        const maxSize = 10*1024;

        if (fileExtension === 'vtt' && file.size <= maxSize) {
          try {
            setIsLoading(true);
            setMessage('');

            const { base64Content } = await validateAndEncodeVttFile(file);

            const payload = {
              fileContent: base64Content,
              fileName: fileName,
            };

            const session = await fetchAuthSession();
            const authToken = session.tokens?.accessToken?.toString();

            const response = await uploadTranscription(authToken, payload);

            setIsLoading(false);
            setMessage('Upload successful!');
            window.location.reload();
            alert('Upload successful:');
          } catch (error) {
            setIsLoading(false);
            setMessage('Error uploading file.');
            alert('Error processing the file:');
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