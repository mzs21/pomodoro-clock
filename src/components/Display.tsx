import { PauseIcon, PlayIcon, RefreshIcon } from "@heroicons/react/solid";
import { useState } from "react";
import Length from "./Length";

let FIFTEEN_HUNDRED = 25 * 60;
let THREE_HUNDRED = 5 * 60;

const Display = () => {
  const [displayTime, setDisplayTime] = useState<number>(5);
  const [breakTime, setBreakTime] = useState<number>(3);
  const [sessionTime, setSessionTime] = useState<number>(5);
  const [timerOn, setTimerOn] = useState<boolean>(false);
  const [onBreak, setOnBreak] = useState<boolean>(false);
  const [breakAudio, setBreakAudio] = useState<HTMLAudioElement>(
    new Audio(
      "https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
    )
  );

  const playBeepSound = () => {
    breakAudio.currentTime = 0;
    breakAudio.play();
  };

  const formatTime = (time: number) => {
    let minutes = Math.floor(time / 60); // get minutes
    let seconds = time % 60; // get seconds

    return (
      (minutes < 10 ? "0" + minutes : minutes) + // add leading zero if needed
      ":" +
      (seconds < 10 ? "0" + seconds : seconds) // add leading zero if needed
    );
  };

  const changeTime = (time: number, type: string) => {
    if (type === "break") {
      if (breakTime <= 60 && time < 0) {
        // prevent negative break time
        return;
      }
      setBreakTime((prev: number) => prev + time); // change break time
    } else {
      if (sessionTime <= 60 && time < 0) {
        // prevent negative session time
        return;
      }
      setSessionTime((prev: number) => prev + time); // change session time
    }

    if (!timerOn) {
      // if timer is on, change display time
      setDisplayTime(sessionTime + time);
    }
  };

  const controlTime = () => {
    let ONE_THOUSAND_MILISECONDS = 1000;
    let date = new Date().getTime();
    let nextDate = new Date().getTime() + ONE_THOUSAND_MILISECONDS;

    let onBreakVar = onBreak;

    if (!timerOn) {
      // if timer is on, start timer
      let interval = setInterval(() => {
        date = new Date().getTime();
        if (date > nextDate) {
          setDisplayTime((prev) => {
            if (prev <= 0 && !onBreakVar) {
              // if session time is up, start break
              playBeepSound();
              onBreakVar = true;
              console.log(onBreak);
              setOnBreak(true);
              return breakTime; // change display time to break time
            } else if (prev <= 0 && onBreakVar) {
              playBeepSound();
              onBreakVar = false;
              setOnBreak(false);
              return sessionTime; // change display time to session time
            }
            return prev - 1;
          });
          nextDate += ONE_THOUSAND_MILISECONDS;
        }
      }, 100);

      localStorage.clear(); // clear local storage
      localStorage.setItem("interval-id", interval.toString()); // save interval id
    }

    if (timerOn) {
      // if timer is off, stop timer
      clearInterval(Number(localStorage.getItem("interval-id") as string));
    }

    setTimerOn(!timerOn); // Toggle timer on/off
  };

  const refreshTime = () => {
    // reset timer
    setDisplayTime(FIFTEEN_HUNDRED);
    setBreakTime(THREE_HUNDRED);
    setSessionTime(FIFTEEN_HUNDRED);
  };
  return (
    <div className="space-y-5">
      <div className="flex justify-center">
        <Length
          title="Break Length"
          type="break"
          formatTime={formatTime}
          time={breakTime}
          changeTime={changeTime}
        />

        <Length
          title="Session Length"
          type="session"
          formatTime={formatTime}
          time={sessionTime}
          changeTime={changeTime}
        />
      </div>
      <h3 className="sub-headline">{onBreak ? "Break" : "Session"}</h3>
      <h1 className="display-time">{formatTime(displayTime)}</h1>

      <div className="display-icons">
        <PauseIcon onClick={controlTime} onChange={() => setTimerOn(true)} />
        <PlayIcon onClick={controlTime} onChange={() => setTimerOn(false)} />
        <RefreshIcon onClick={refreshTime} />
      </div>
    </div>
  );
};

export default Display;
