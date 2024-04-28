"use client"

import React, { useState, useEffect } from 'react';
import '../globals.css';

if (!Element.prototype.addEventListener) {
  Element.prototype.addEventListener = function (type, listener) {
    this.attachEvent('on' + type, listener);
  };
}

if (typeof window.AudioContext === 'undefined') {
  window.AudioContext = window.webkitAudioContext;
}

const Music = () => {
  const [pressedKey, setPressedKey] = useState(null);
  const [currentAudio, setCurrentAudio] = useState(null);
  const audioFiles = {};

  const alphabets = 'abcdefghijklmnopqrstuvwxyz';

  alphabets.split('').forEach(alpha => {
    audioFiles[alpha] = `/${alpha}.mp3`;
  });

  function loadAudio(url) {
    return new Promise((res, rej) => {
      const audio = new Audio(url);
      audio.addEventListener('canplaythrough', () => res(audio));
      audio.addEventListener('error', rej);
    });
  }

  function playAudio(audio) {
    if (currentAudio) {
      currentAudio.pause();
    }
    audio.currentTime = 0;
    audio.play();
    setCurrentAudio(audio);
  }

  function handleKeyPress(event) {
    const key = event.key.toLowerCase();
    if (audioFiles[key]) {
      loadAudio(audioFiles[key])
        .then(audio => playAudio(audio))
        .catch(error => console.error('Error loading audio:', error));
    }
    setPressedKey(key);
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [currentAudio]);

  const qwertyLayout = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm']
  ];

  return (
    <div className="keyboard-container">
      <div className="keyboard">
        {qwertyLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((key) => (
              <div
                key={key}
                className={`key ${pressedKey === key ? 'pressed' : ''}`}
                onClick={() => handleKeyPress({ key })}
              >
                {key.toUpperCase()}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Music;
