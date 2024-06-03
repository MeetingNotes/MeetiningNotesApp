import React from "react";
import styles from './UploadButton.module.css'

export const UploadButton = () => {

    const handleAdd = () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.vtt';
        fileInput.style.display = 'none';
    
        // Add an event listener to handle the file selection
        fileInput.addEventListener('change', (event) => {
          const file = event.target.files[0];
          if (file) {
            const fileName = file.name;
            const fileExtension = fileName.split('.').pop();
    
            if (fileExtension === 'vtt') {
              // Handle the VTT file
              console.log('File selected:', file);
              // Perform further processing here, e.g., reading the file content
            } else {
              alert('Please select a VTT file.');
            }
          }
        });
    
        // Simulate a click on the file input element to open the file picker
        fileInput.click();
      };

    return(
        <div className={styles.addbutton} onClick={handleAdd}>
        Upload
        </div>
    );
};