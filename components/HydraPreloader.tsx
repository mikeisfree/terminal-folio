'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './HydraPreloader.module.css';

const MAX_CHARACTERS = 24;
const UNLOADED_CHAR = '.';
const LOADED_CHAR = '#';
const SPINNER_FRAMES = ['/', '-', '\\', '|'];

interface HydraPreloaderProps {
  onComplete?: () => void;
}

export default function HydraPreloader({ onComplete }: HydraPreloaderProps) {
  const [loadingPercent, setLoadingPercent] = useState(0);
  const [bar, setBar] = useState<string[]>(Array(MAX_CHARACTERS).fill(UNLOADED_CHAR));
  const [spinner, setSpinner] = useState(SPINNER_FRAMES[0]);
  const [rebooting, setRebooting] = useState(true);
  const [done, setDone] = useState(false);
  const spinnerIndex = useRef(0);
  const spinnerInterval = useRef<NodeJS.Timeout | null>(null);

  const drawLoadingBar = async () => {
    for (let i = 0; i < MAX_CHARACTERS; i++) {
      await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 50) + 25));
      setBar(prev => {
        const updated = [...prev];
        updated[i] = LOADED_CHAR;
        return updated;
      });
      setLoadingPercent(Math.floor(((i + 1) / MAX_CHARACTERS) * 100));
    }
  };

  const startSpinner = () => {
    spinnerInterval.current = setInterval(() => {
      spinnerIndex.current = (spinnerIndex.current + 1) % SPINNER_FRAMES.length;
      setSpinner(SPINNER_FRAMES[spinnerIndex.current]);
    }, Math.floor(Math.random() * 250) + 50);
  };

  const stopSpinner = () => {
    if (spinnerInterval.current) clearInterval(spinnerInterval.current);
  };

  const runSequence = async () => {
    setBar(Array(MAX_CHARACTERS).fill(UNLOADED_CHAR));
    setLoadingPercent(0);
    setRebooting(true);
    setDone(false);
    startSpinner();
    await drawLoadingBar();
    stopSpinner();
    setRebooting(false);
    setTimeout(() => {
      setDone(true);
      onComplete?.(); // notify parent
    }, 2000);
  };

  useEffect(() => {
    runSequence();
    return () => stopSpinner();
  }, []);

  return (
    <>
      {!done && (
        <>
          <div className={`${styles.terminal} ${rebooting ? styles.glitch : ''}`}>
            <div className={styles.scanline}></div>
            {rebooting && <p className={styles.spinner}>[{spinner}]</p>}
            <div className={styles.hydra}>
              {rebooting ? (
                <div className={styles.loadingBox}>
                  <p>&lt; ⬯⫰⦣⨎⩄⩑ ⨎⩑⬯⫰⦣⩄ &gt;</p>
                  <p className={styles.textSm}>⩂⩏⦪⦼ ⦓⦵⩩⩂ X.1 ⬯⫰⦣⨎⩄⩑</p>
                  <p className={styles.textSm}>GALILEO: {loadingPercent}%</p>
                  <p className={styles.loadingBar}>
                    (
                    {bar.map((char, i) =>
                      char === UNLOADED_CHAR ? (
                        <span key={i} className={styles.unloaded}>
                          {char}
                        </span>
                      ) : (
                        <span key={i}>{char}</span>
                      )
                    )}
                    )
                  </p>
                </div>
              ) : (
                <div>
                  <p>GALILEO INITIALIZED</p>
                </div>
              )}
            </div>
          </div>

          {/* Glitch clones */}
          <div className={`${styles.terminal} ${styles.glitchClone} ${styles.glitchTop}`} aria-hidden="true">
            <div className={styles.hydra}>
              <p>&lt; SURFACE PREPARED &gt;</p>
            </div>
          </div>
          <div className={`${styles.terminal} ${styles.glitchClone} ${styles.glitchBottom}`} aria-hidden="true">
            <div className={styles.hydra}>
              <p>&lt; SURFACE PREPARED &gt;</p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
