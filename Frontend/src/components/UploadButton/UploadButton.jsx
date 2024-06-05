import React from "react";
import styles from './UploadButton.module.css'

export const UploadButton = () => {

  const handleAdd = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.vtt';
    fileInput.style.display = 'none';
  
    fileInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (file) {
        const fileName = file.name;
        const fileExtension = fileName.split('.').pop();
        const maxSize = 10 * 1024;
  
        if (fileExtension === 'vtt') {
          if (file.size <= maxSize) {
            console.log('File selected:', file);
          } else {
            alert('File size exceeds 100KB. Please select a smaller file.');
          }
        } else {
          alert('Please select a VTT file.');
        }
      }
    });
  
    fileInput.click();
  };
  

    return(
        <button className={styles.addbutton} onClick={handleAdd}>
        Upload
        </button>
    );
};