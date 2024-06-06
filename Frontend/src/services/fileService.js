import vttToJson from 'vtt-to-json';

export const validateAndEncodeVttFile = async (file) => {
  try {
    // console.log('Validating and encoding VTT file:', file.name);

    const fileContent = await readFileContent(file);
    // console.log('File content read successfully');

    const vttData = await vttToJson(fileContent);
    // console.log('VTT data parsed successfully');

    const base64Content = btoa(fileContent);
    // console.log('File content encoded to base64');

    return { base64Content, vttData };
  } catch (error) {
    alert('Error validating and encoding VTT file:');
    throw error;
  }
};

const readFileContent = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(new Error('Error reading file'));
    reader.readAsText(file);
  });
};
