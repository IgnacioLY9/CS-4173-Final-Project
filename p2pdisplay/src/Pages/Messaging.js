import { useEffect, useState, useReducer } from 'react'
import Gun from 'gun'
import { useLocation, Navigate } from 'react-router-dom';
import { VoiceMessage } from '../Components/VoiceMessage.js'
import { DecryptedMessage } from '../Components/DecryptedMessage.js';
import '../Styling/Messaging.css'
import CryptoJS from "crypto-js"

const gun = Gun({
  peers: [
    'http://localhost:3030/gun'
  ]
})

const initialState = {
  messages: []
}

function reducer(state, newMessage) {
  if (state.messages.find(msg => msg.id === newMessage.id)) {
    return state;
  }

  return {
    messages: [newMessage, ...state.messages]
  }
}

function encryptData(plaintext, cipher, key) {
  if (cipher === 'DES') {
    return CryptoJS.DES.encrypt(plaintext, key).toString();
  }
  else {
    return CryptoJS.AES.encrypt(plaintext, key).toString();
  }
}

function Messaging() {
  const location = useLocation()
  const { username, hashedPassword, cipher } = location.state || {}
  const password = hashedPassword;
  const group = CryptoJS.SHA512(password).toString();
  const [voiceKey, setVoiceKey] = useState(0);
  
  const [formState, setForm] = useState({
    name: username, message: '', file: null, audio: null
  })

  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    const messages = gun.get('messages');
    const seen = new Set();

    messages.map().once(m => {
        if (!m) return;

        const id = m._?.['#'] || m.createdAt;
        
        if (!seen.has(id)) {
        seen.add(id);
        dispatch({
            name: m.name,
            message: m.message,
            createdAt: m.createdAt,
            group: m.group,
            uploadAudio: m.uploadAudio,
            uploadFile: m.uploadFile,
            fileName: m.fileName,
            cipher: m.cipher,
            id
        });
        }
    });
  }, []);

  if (!username || !password) {
    return <Navigate to="/" replace />
  }

  async function saveMessage() {
    if (!formState.message.trim() && !formState.file && !formState.audio) {
      alert("Input is required");
      return;
    }
    let uploadMessage = encryptData(formState.message, cipher, password);
    let uploadFile = null;
    if (formState.file) {
      let file64 = await toBase64(formState.file);
      uploadFile = encryptData(file64, cipher, password);
      //uploadFile = file64;
    }
    let uploadAudio = null;
    if (formState.audio) {
      let audio64 = await toBase64(formState.audio);
      uploadAudio = encryptData(audio64, cipher, password);
    }
    const messages = gun.get('messages');
    messages.set({
      name: formState.name,
      message: uploadMessage,
      createdAt: Date.now(),
      group: group,
      uploadFile,
      uploadAudio,
      cipher: cipher,
      fileName: formState.file ? encryptData(formState.file.name, cipher, password) : null
    });
    setForm({
      name: username,
      message: '',
      file: null,
      audio: null
    });
    setVoiceKey(prev => prev + 1);
  }

  function toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  function handleVoiceRecording(audio) {
    setForm(prev => ({ ...prev, audio }));
  }

  function onChange(e) {
    if(e.target.type === "file") {
      setForm({ ...formState, [e.target.name]: e.target.files[0]  })
    }
    else {
      setForm({ ...formState, [e.target.name]: e.target.value  })
    }
  }

  return (
    <div className='Everything'>
      <div className='InputBlock'>
        <div className='Inputs'>
          <input className='Textbox' onChange={onChange} placeholder="Message" name="message" value={formState.message}/>

          <VoiceMessage key={voiceKey} onRecordingComplete={handleVoiceRecording}/>

          <input className='File' type="file" onChange={onChange} name="file"/>
        </div>

        <button className='Send' onClick={saveMessage}>Send Message</button>
      </div>

      {
        state.messages
          .filter(message => message.group === group && message.cipher === cipher)
          .sort((a, b) => b.createdAt - a.createdAt)
          .map(message => (
            <DecryptedMessage key={message.id} message={message} password={password} />
          ))
      }
    </div>
  );
}

export {Messaging}
