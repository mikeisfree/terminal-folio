import { useEffect, useRef, useState, useCallback } from 'react';
import styles from './VideoLoader.module.css';
import { getVideoPath } from '@/lib/utils';
import { Video } from '@/components/ui/video';

const LOAD_DURATION = 20000; // 20 seconds
const MIN_LOAD_TIME = 0; // 2 seconds minimum before skip

interface Props {
  onLoadComplete: () => void;
  onSkip: () => void;
}

const VideoLoader = ({ onLoadComplete, onSkip }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const timersRef = useRef<{ skip?: NodeJS.Timeout; complete?: NodeJS.Timeout }>({});
  const interactionRef = useRef(false); // To track interaction state without causing re-renders for listener removal
  const [canSkip, setCanSkip] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [showInteractionPrompt, setShowInteractionPrompt] = useState(false);
  const [statusText, setStatusText] = useState('Loading...');

  // Stable callback for skipping
  const handleSkip = useCallback(() => {
    console.log('Skip triggered');
    // Clear timers immediately on skip
    Object.values(timersRef.current).forEach(timer => timer && clearTimeout(timer));
    onSkip();
  }, [onSkip]);

  // Stable callback for completion
  const handleLoadComplete = useCallback(() => {
    console.log('Load Complete triggered');
    // Clear timers immediately on completion
    Object.values(timersRef.current).forEach(timer => timer && clearTimeout(timer));
    onLoadComplete();
  }, [onLoadComplete]);


  // Effect for video setup and playback attempts
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let interactionListener: (() => void) | null = null;

    const attemptPlay = async (isUserInitiated = false) => {
      try {
        // Always try to play when ready or interacted
        await video.play();
        console.log('Playback started/resumed.');
        // If playback succeeded without prior interaction, it must be muted autoplay
        if (!interactionRef.current && !video.muted) {
           console.warn('Video started unmuted without interaction - unexpected.');
        }
        // If user initiated, ensure it's unmuted
        if (isUserInitiated) {
            video.muted = false;
        }
        setStatusText(canSkip ? 'Press SPACE to skip' : 'Starting...');

      } catch (error) {
        console.error('Playback failed:', error);
        if (!interactionRef.current) {
          setShowInteractionPrompt(true);
          // More specific message when muted autoplay failed OR paused waiting for sound permission
          setStatusText('Click anywhere or press any key to enable sound');
        } else {
          setStatusText('Playback error. Trying to continue...');
        }
      }
    };

    const handleCanPlay = () => {
      console.log('Video can play.');
      setIsVideoReady(true);
      setStatusText('Attempting to play...'); // Initial status
      // Attempt initial (likely muted) playback
      attemptPlay();
    };

    const handleInteraction = () => {
      if (interactionRef.current || !video) return;
      console.log('User interaction detected.');
      interactionRef.current = true;
      setShowInteractionPrompt(false); // Hide prompt
      video.muted = false;
      // Update status based on whether skip is already possible
      setStatusText(canSkip ? 'Press SPACE to skip' : 'Starting...');
      attemptPlay(true); // Attempt to play unmuted

        // Remove interaction listeners after first interaction
        if (interactionListener) {
            window.removeEventListener('click', interactionListener);
            window.removeEventListener('keydown', interactionListener);
        }
    };

    // Assign interaction handler to a variable for easier removal
    interactionListener = handleInteraction;

    // --- Timer Setup ---
    // Clear any existing timers on re-render (though deps should prevent unnecessary ones)
    Object.values(timersRef.current).forEach(timer => timer && clearTimeout(timer));

    // Set timers regardless of playback state, start counting from mount/ready
    timersRef.current.skip = setTimeout(() => {
      console.log('Min load time reached. Enabling skip.');
      setCanSkip(true);
      // Only update to "Press SPACE" if we are not currently waiting for interaction
      if (!showInteractionPrompt) {
          setStatusText('Press SPACE to skip');
      }
      // If we ARE waiting for interaction, keep that prompt, but skip is still enabled
  }, MIN_LOAD_TIME);
  

    timersRef.current.complete = setTimeout(handleLoadComplete, LOAD_DURATION);
    // --- End Timer Setup ---


    // --- Event Listeners ---
    video.addEventListener('canplay', handleCanPlay);
    // Add interaction listeners only if interaction hasn't happened
    if (!interactionRef.current) {
        window.addEventListener('click', interactionListener);
        window.addEventListener('keydown', interactionListener);
    }

    const handleKeyPress = (e: KeyboardEvent) => {
      // Skip logic is independent of the initial interaction logic now
      if (e.code === 'Space' && canSkip) {
        e.preventDefault();
        handleSkip();
      }
      // If interaction hasn't happened, the generic keydown listener above will call handleInteraction
    };

    // Separate listener specifically for the skip functionality
    window.addEventListener('keydown', handleKeyPress);


    // --- Cleanup ---
    return () => {
      console.log('Cleaning up VideoLoader effect.');
      video.removeEventListener('canplay', handleCanPlay);
      // Ensure all listeners are removed
      if (interactionListener) {
          window.removeEventListener('click', interactionListener);
          window.removeEventListener('keydown', interactionListener);
      }
      window.removeEventListener('keydown', handleKeyPress); // Remove skip listener

      Object.values(timersRef.current).forEach(timer => timer && clearTimeout(timer));
      if (video) {
        video.pause();
        // Optional: Reset video source to release memory
        // video.src = '';
        // video.load();
      }
    };
    // Dependencies: Callbacks are memoized, canSkip changes state, showInteractionPrompt changes state
  }, [canSkip, showInteractionPrompt, handleSkip, handleLoadComplete]); // Added showInteractionPrompt

  return (
    <div className={styles.loaderContainer}>
      <Video
        ref={videoRef}
        className={styles.loaderVideo}
        src="loader.mp4"
        playsInline
        preload="auto"
        loop // Keep loop
        muted // Start muted - Increases chance of autoplay working
      />
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm opacity-75 pointer-events-none">
 {/* Status text is now managed more dynamically */}
 {statusText}
  {/* Optional: Add a visual cue if interaction is needed */}
  {showInteractionPrompt && <span className="animate-pulse"> (Interaction required)</span>}
      </div>
    </div>
  );
};

export default VideoLoader;
