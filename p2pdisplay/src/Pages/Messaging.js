import { useEffect, useState, useReducer } from 'react'
import Gun from 'gun'
import { useLocation, Navigate } from 'react-router-dom';
import { VoiceMessage } from '../Components/VoiceMessage.js'
import '../Styling/Messaging.css'

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

function Messaging() {
  const location = useLocation()
  const { username, password } = location.state || {}
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
            id
        });
        }
    });
  }, []);

  if (!username || !password) {
    return <Navigate to="/" replace />
  }

  async function saveMessage() {
    if (!formState.message.trim()) {
      alert("Message text is required");
      return;
    }
    let uploadFile = null;
    if (formState.file) {
      uploadFile = await toBase64(formState.file);
    }
    let uploadAudio = null;
    if (formState.audio) {
      uploadAudio = await toBase64(formState.audio);
    }
    const messages = gun.get('messages');
    messages.set({
      name: formState.name,
      message: formState.message,
      createdAt: Date.now(),
      group: password,
      uploadFile,
      uploadAudio,
      fileName: formState.file ? formState.file.name : null
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
          .filter(message => message.group === password)
          .sort((a, b) => b.createdAt - a.createdAt)
          .map(message => (
            <div key={message.id} style={{ marginBottom: 20 }}>
              <h2>{message.message}</h2>
              <h3>From: {message.name}</h3>
              <p>Date: {new Date(message.createdAt).toLocaleString()}</p>
              <p>Group: {message.group}</p>
              {message.uploadFile && (
                <div>
                  <p>File:</p>
                    {message.uploadFile.startsWith('data:image') ? (
                      <img src={message.uploadFile} alt="Uploaded" style={{ maxWidth: '300px' }} />
                    ) : (
                      <a href={message.uploadFile} download={message.fileName}>
                        {message.fileName}
                      </a>
                    )}
                </div>
              )}
              {message.uploadAudio && (
                <div>
                  <p>Voice Message:</p>
                  <audio controls src={message.uploadAudio} />
                </div>
              )}
              
            </div>
          ))
      }

    </div>
  );
}

export {Messaging}
