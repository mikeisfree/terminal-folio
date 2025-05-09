import {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import Image from "next/image";

export interface SpeechRecognitionHandle {
  stop: () => void;
}

interface Props {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  formRef: React.RefObject<HTMLFormElement | null>;
}

const SpeechRecognitionComponent = forwardRef<SpeechRecognitionHandle, Props>(
  ({ input, setInput, formRef }, ref) => {
    const [listening, setListening] = useState(false);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const isRecognizingRef = useRef(false);
    const ctrlPressed = useRef(false);
    const lastStartAttempt = useRef<number>(0);

    useImperativeHandle(ref, () => ({
      stop: () => {
        stopRecognition();
      },
    }));

    const forceResetState = () => {
      isRecognizingRef.current = false;
      setListening(false);
      ctrlPressed.current = false;
    };

    const startRecognition = () => {
      if (!recognitionRef.current) return;

      // Prevent rapid start attempts
      const now = Date.now();
      if (now - lastStartAttempt.current < 1000) {
        console.log("Preventing rapid start attempt");
        return;
      }
      lastStartAttempt.current = now;

      try {
        // Double-check state and force reset if necessary
        if (isRecognizingRef.current) {
          console.log("Recognition already active, forcing reset");
          recognitionRef.current.stop();
          forceResetState();
          // Wait a bit before starting again
          setTimeout(() => {
            recognitionRef.current?.start();
            isRecognizingRef.current = true;
            setListening(true);
          }, 100);
        } else {
          recognitionRef.current.start();
          isRecognizingRef.current = true;
          setListening(true);
        }
      } catch (error) {
        console.error("Failed to start recognition:", error);
        forceResetState();
      }
    };

    const stopRecognition = () => {
      if (!recognitionRef.current) return;
      
      try {
        if (isRecognizingRef.current) {
          recognitionRef.current.stop();
        }
      } catch (error) {
        console.error("Failed to stop recognition:", error);
      } finally {
        forceResetState();
      }
    };

    useEffect(() => {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        console.warn("Speech recognition not supported");
        return;
      }

      // Cleanup any existing instance
      if (recognitionRef.current) {
        stopRecognition();
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        console.log("Recognition started");
        isRecognizingRef.current = true;
        setListening(true);
      };

      recognition.onend = () => {
        console.log("Recognition ended");
        forceResetState();
        if (formRef.current && input.trim()) {
          formRef.current.requestSubmit();
        }
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        if (!isRecognizingRef.current) return;
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setInput((prev: string) => prev.trim() + " " + transcript.trim());
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        forceResetState();
      };

      recognitionRef.current = recognition;

      const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.key === 'Control' || e.key === 'Meta') && !ctrlPressed.current) {
          ctrlPressed.current = true;
        } else if ((e.key === 'a' || e.key === 'A') && ctrlPressed.current && !isRecognizingRef.current) {
          e.preventDefault();
          startRecognition();
        }
      };

      const handleKeyUp = (e: KeyboardEvent) => {
        if (e.key === 'Control' || e.key === 'Meta') {
          if (isRecognizingRef.current) {
            stopRecognition();
          }
          ctrlPressed.current = false;
        }
      };

      // Enhanced focus and blur handlers
      const handleFocus = () => {
        // Reset state when window gains focus
        forceResetState();
      };

      const handleBlur = () => {
        if (isRecognizingRef.current) {
          stopRecognition();
        }
        forceResetState();
      };

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      window.addEventListener('focus', handleFocus);
      window.addEventListener('blur', handleBlur);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        window.removeEventListener('focus', handleFocus);
        window.removeEventListener('blur', handleBlur);
        stopRecognition();
      };
    }, [setInput, input, formRef]);

    const toggleListening = () => {
      if (isRecognizingRef.current) {
        stopRecognition();
      } else {
        startRecognition();
      }
    };

    return (
      <button
        type="button"
        onClick={toggleListening}
        className={`ml-2 rounded text-white transition-colors duration-200 ${
          listening ? "bg-red-600" : "bg-gray-600 hover:bg-gray-500"
        }`}
        title="Toggle Speech Recognition (Ctrl+A)"
      >
        <Image 
          src="/ico/microphone.png"
          alt="microphone icon"
          width={40}
          height={40}
          className={listening ? "animate-pulse" : ""}
        />
      </button>
    );
  });

SpeechRecognitionComponent.displayName = "SpeechRecognitionComponent";
export default SpeechRecognitionComponent;