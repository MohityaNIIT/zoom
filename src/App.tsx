import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [sdkReady, setSdkReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');

  const zoomSdk = (window as any).zoomSdk;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (zoomSdk) {
      zoomSdk.config({
        capabilities: [
          'getAppContext',
          'postMessage',
          'getMeetingParticipants',
        ],
      });

      zoomSdk.ready()
        .then(() => {
          console.log('✅ Zoom SDK is ready');
          setSdkReady(true);
        })
        .catch((err: any) => {
          console.error('❌ Zoom SDK error:', err);
        });
    }
  }, []);

  const sendMessage = () => {
    if (input.trim() !== '') {
      setMessages([...messages, input]);
      setInput('');
    }
  };

  return (
    <div className="chat-container">
      {open && (
        <div className="chat-box">
          <div className="messages">
            {messages.map((msg, i) => (
              <div key={i} className="message">{msg}</div>
            ))}
          </div>
          <div className="input-area">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end'
      }}>
        <button className="toggle-button" onClick={() => setOpen(!open)}>
          {open ? 'Close Chat' : 'Open Chat'}
        </button>
      </div>
      {!sdkReady && (
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <div className="sdk-warning">Zoom SDK not ready or not in Zoom App</div>
        </div>
      )}
    </div>
  );
}

export default App;
