import React, { useEffect, useRef, useState } from "react";
import { faker } from "@faker-js/faker";
import { BsKeyboardFill } from "react-icons/bs";

const SECONDS = 60;
const TypingUI = () => {
  const [words, setWords] = useState([]);
  const [countDown, setCountDown] = useState(SECONDS);
  const [userInput, setUserInput] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(-1);
  const [currentChar, setCurrentChar] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [gameStatus, setgameStatus] = useState("waiting");
  const textInput = useRef(null);

  useEffect(()=>{
    if(gameStatus === 'started'){
      textInput.current.focus()
    }
  }, [gameStatus]);

  const generateWords = () => {
    const generatedWords = faker.word.words(200).split(" ");
    setWords(generatedWords);
  };
  useEffect(() => {
    generateWords();
  }, []);

  const start = () => {
    if(gameStatus === 'finished'){
      setUserInput("");
      setCurrentIndex(0);
      setCorrect(0)
      setIncorrect(0);
      setCurrentCharIndex(-1);
      setCurrentChar("");
    }
    if(gameStatus != 'stated'){
      setgameStatus('started');
      let interval = setInterval(() => {
        setCountDown((prev) => {
          if (prev === 0){
            clearInterval(interval);
            setgameStatus('finished');
            setUserInput("");
            return SECONDS;
          } else {
            return prev - 1;
          }
        });
      }, 1000);
    }
    
  };

  //this function for handling input
  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  //this function is for checking each word
  const checkMatch = () => {
    const wordToCompare = words[currentIndex];
    const doesIsMatch = wordToCompare === userInput.trim();
    if (doesIsMatch) {
      setCorrect(correct + 1);
    } else {
      setIncorrect(incorrect + 1);
    }
  };
  const handleKeyDown = ({ keyCode, key }) => {
    //space bar
    if (keyCode === 32) {
      checkMatch();
      setUserInput("");
      setCurrentIndex(currentIndex + 1);
      setCurrentCharIndex(-1); //after space Curr char start from -1 means one backward index for particular word
    } else if(keyCode === 8){//for backspace
        setCurrentCharIndex(currentCharIndex-1);
        setCurrentChar("");
    } else{
      setCurrentCharIndex(currentCharIndex + 1); //for increment of each char index for checking that char is right or wrong
      setCurrentChar(key); //setting current char, by taking the value of key
    }
  };

  //adding that green and red word functionality
  function getCharClass(wordIdx, charIdx, char){
    if(wordIdx === currentIndex && charIdx === currentCharIndex && currentChar && gameStatus != 'finished'){
      if(char === currentChar){
        return 'bg-green-500'
      }else{
        return 'bg-red-500'
      }
    }else if(wordIdx === currentIndex && currentCharIndex >= words[currentIndex].length){
      return 'bg-red-500'
    }else{
      return '';
    }
  }
  
  return (
    <main className="w-[1440px] h-[800px] bg-white m-auto rounded-lg shadow-2xl flex-col flex justify-start items-center gap-6">
      <div className="text-center mt-2">
        <h1 className="text-6xl text-green-600 font-mono font-bold">
          {countDown}
        </h1>
      </div>
      <div className="w-[1350px] h-[370px] bg-transparent bg-gray-200 rounded-md p-4">
        {gameStatus === "started" ? (
          <p className="text-xl text-gray-800 text-center font-semibold tracking-wide">
            {words.map((word, i) => (
              <span key={i}>
                <span>
                {word.split("").map((char, idx) => (
                  <span className={getCharClass(i, idx, char)}key={idx}>{char}</span>
                ))}
                </span>
                <span> </span>
              </span>
            ))}
          </p>
        ) : (
          <div className="mt-20 flex justify-center items-center flex-col">
            <h1 className="font-mono font-extrabold text-4xl text-blue-800 flex items-center">
              Check Your <BsKeyboardFill className="mr-3 ml-3"/> Speed
            </h1>
          </div>
        )}
      </div>
      <input
        className="w-[400px] p-1 border border-gray-400 rounded-md focus:outline-none focus:ring focus:to-blue-400 text-center font-medium"
        type="text"
        placeholder="Start Typing ..."
        value={userInput}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        disabled={gameStatus === "waiting" || gameStatus === 'finished'}
        ref={textInput}
      ></input>

      <button
        className="mt-4 px-7 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring"
        onClick={start}
      >
        Start
      </button>

      {gameStatus === "finished" && (
        <section className="flex flex-row justify-between items-center gap-[450px] mt-8">
          <div className="text-center">
            <p className="font-mono font-bold text-2xl">Words per minute:</p>
            <p className="font-mono font-semibold text-6xl mt-3 text-yellow-500">
              {correct}
            </p>
          </div>
          <div className="text-center">
            <p className="font-mono font-bold text-2xl ">Accuracy:</p>
            <p className="font-mono font-semibold text-6xl mt-3 text-green-500">
              {Math.round((correct / (correct + incorrect)) * 100)}%
            </p>
          </div>
        </section>
      )}
    </main>
  );
};

export default TypingUI;
