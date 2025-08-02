// component that diplays an individual message in the messaging page

import React from 'react';
import CryptoJS from "crypto-js";

const DecryptedMessage = React.memo(({ message, password }) => {
  const decryptedMessage = decryptData(message.message, message.cipher, password);
  const file = message.uploadFile ? decryptData(message.uploadFile, message.cipher, password) : null;
  const fileName = message.fileName ? decryptData(message.fileName, message.cipher, password) : null;
  const audio = message.uploadAudio ? decryptData(message.uploadAudio, message.cipher, password) : null;

  return (
    <div style={{ marginBottom: 20 }}>
      <h3>From: {message.name} on {new Date(message.createdAt).toLocaleString()}</h3>
      <h3 style={{ 
      wordBreak: 'break-word',
      whiteSpace: 'pre-wrap',
      overflowWrap: 'anywhere'
    }} >{decryptedMessage}</h3>
      {file && (
        <div>
          {file.startsWith('data:image') ? (
            <img src={file} alt="Uploaded" style={{ maxWidth: '300px' }} />
          ) : (
            <a href={file} download={fileName}>{fileName}</a>
          )}
        </div>
      )}

      {audio && (
        <div>
          <audio controls src={audio} />
        </div>
      )}
    </div>
  );
});

function decryptData(ciphertext, cipher, key) {
  let decrypted;

  if (cipher === 'DES') {
    decrypted = CryptoJS.DES.decrypt(ciphertext, key);
  } else {
    decrypted = CryptoJS.AES.decrypt(ciphertext, key);
  }

  return decrypted.toString(CryptoJS.enc.Utf8);
}

export {DecryptedMessage};