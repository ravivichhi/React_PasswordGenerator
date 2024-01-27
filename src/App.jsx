import './App.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import emailjs from '@emailjs/browser';

function App() {
  const [length, setLength] = useState(6)
  const [password, setPassword] = useState(null)
  const [message, setMessage] = useState(null)
  const [numberAllowed, setNumberAllowed] = useState(false)
  const [charAllowed, setCharAllowed] = useState(false)

  const passwordRef = useRef(null)

  const form = useRef();

  const passwordgenerator = useCallback(() => {
      let pass = '';
      let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

      if (numberAllowed) str += '0123456789';
      if (charAllowed) str += '!@#$%&*_-()?><{}[]';

      for (let i = 1; i < length; i++) {
        let char = Math.floor(Math.random() * str.length + 1)
        pass += str.charAt(char)
      }
      setPassword(pass)

  },[length,numberAllowed,charAllowed,setPassword])

  useEffect(() => {
    passwordgenerator()
  },[length,numberAllowed,charAllowed,passwordgenerator])

  const copyclipboard = useCallback(() => {
    passwordRef.current?.select()
    passwordRef.current?.setSelectionRange(0,20)
    window.navigator.clipboard.writeText(password)
  },[password])

  const sendEmail = (e) => {
    e.preventDefault();
    emailjs.sendForm(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID, 
        form.current, 
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
        )
        .then((result) => {
            setMessage('Email sent successfully with your password record!')
            form.current.reset();
            
        }, (error) => {
            console.log(error.text);
            console.log("error sending message, try again!")
        });
    };

  return (
    <>
      <div className='text-black px-5 py-5 rounded-md text-center justify-center m-5 bg-gray-400 text-black mt-25'>
        <h2 className="text-2xl mb-4"><b>Password Generator</b></h2>
        <div className="flex items-center justify-center mb-4">
          <input
            type="text"
            className="border border-gray-600 rounded px-2 py-1 mr-2 w-56 text-black"
            placeholder="Generated Password"
            value={password || ''}
            ref={passwordRef}
            readOnly
          />
          <button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={copyclipboard}
          >
            Copy
          </button>
        </div>
        <div className="flex items-center justify-center mb-4">
          <input
            type="range"
            className="w-30"
            min={6}
            max={20}
            value={length || ''}
            onChange={(e) => {setLength(e.target.value)}}
          />
          <label>Length : {length}</label>
        </div>
        <div className="flex items-center justify-center mb-2">
          <input
            type="checkbox"
            className="mr-2"
            onClick={() => {setNumberAllowed((prev) => !prev)}}
          />
          Numbers
          <input
            type="checkbox"
            className="ml-4 mr-2"
            onClick={() => {setCharAllowed((prev) => !prev)}}
          />
          Characters
        </div>
      </div>
        <div className='text-black px-5 py-5 rounded-md text-center justify-center m-5 bg-gray-400 text-black mt-10'>
        <h2 className="text-2xl mb-4">
          <b>Email Form</b>
        </h2>
          <p style={{ color:'green' }}>{message}</p>
        <form
          ref={form}
          onSubmit={sendEmail}
          className="flex flex-col items-center justify-center"
        >
          <div className="flex items-center justify-center mb-4">
          <input
            name="reply_to"
            type="email"
            className="border border-gray-600 rounded px-2 py-1 mr-2 w-56 text-black"
            placeholder="Email"
            required
          />
          <input
            name="password"
            type="hidden"
            className="border border-gray-600 rounded px-2 py-1 mr-2 w-56 text-black"
            value={password || ''}
            required
          />
          </div>
          <textarea
            name="message"
            className="border border-gray-600 rounded px-2 py-1 mr-2 w-56 text-black mt-2"
            placeholder="Write message..."
            required
          ></textarea>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
          >
            Send Mail
          </button>
        </form>
      </div>
    </>


  );
}

export default App;
