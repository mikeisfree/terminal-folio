import { useEffect, useRef, useState } from "react";
import Image from 'next/image'; // Add this import at the top


interface Props {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
}

const SpeechRecognitionComponent = ({ input, setInput }: Props) => {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isRecognizingRef = useRef(false);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      isRecognizingRef.current = true;
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        finalTranscript += transcript;
        if (event.results[i].isFinal) {
          setInput((prev: string) => prev.trim() + " " + transcript.trim());
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
    };

    recognitionRef.current = recognition;
  }, [setInput]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (!isRecognizingRef.current) {
      recognitionRef.current.start();
      setListening(true);
    } else {
      recognitionRef.current.stop();
      setListening(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleListening}
      className={`ml-2 rounded text-white ${
        listening ? "bg-red-600" : "bg-gray-200"
      }`}
      title="Toggle Speech Recognition"
    >
      <Image 
        src="/ico/microphone.png"
        alt="microphone icon"
        width={40}
        height={40}
        mix-blendMode="lighten"
      />
      {/* 🎤      */}
    </button>
  );
};

export default SpeechRecognitionComponent;
