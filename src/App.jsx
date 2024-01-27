import './App.css';
import { useCallback, useEffect, useRef, useState } from 'react';

function App() {
  const [length, setLength] = useState(6)
  const [password, setPassword] = useState(null)
  const [numberAllowed, setNumberAllowed] = useState(false)
  const [charAllowed, setCharAllowed] = useState(false)

  const passwordRef = useRef(null)

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

  return (
    <>
      <div className='text-black px-5 py-5 rounded-md text-center justify-center m-5 bg-gray-300 text-black w-2/5 mx-auto mt-32'>
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
    </>


  );
}

export default App;
