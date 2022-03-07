import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Slider from "rc-slider";
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";

import usePlayer from "../../contexts/PlayerContext";

import playingPic from "../../../public/playing.svg";
import shufflePic from "../../../public/shuffle.svg";
import playPrevPic from "../../../public/play-previous.svg";
import playPic from "../../../public/play.svg";
import pausePic from "../../../public/pause.svg";
import playNextPic from "../../../public/play-next.svg";
import repeatPic from "../../../public/repeat.svg";

import styles from "./styles.module.scss";

import "rc-slider/assets/index.css";

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);

  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    isLooping,
    isShuffling,
    hasNext,
    hasPrevious,
    playNext,
    playPrevious,
    togglePlay,
    toggleLoop,
    toggleShuffle,
    setPlayingState,
    clearPlayerState,
  } = usePlayer();

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  function setupProgressListener() {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.addEventListener("timeupdate", () =>
        setProgress(audioRef.current?.currentTime || 0)
      );
    }
  }

  function handleSeek(amount: number | number[]) {
    if (audioRef.current && typeof amount === "number") {
      audioRef.current.currentTime = amount as number;
      setProgress(amount);
    }
  }

  function handleEpisodeEnded() {
    if (hasNext) {
      playNext();
    } else {
      clearPlayerState();
    }
  }

  const episode = episodeList[currentEpisodeIndex];

  return (
    <div className={styles.playerContainer}>
      <header>
        <Image src={playingPic} alt="Tocando agora" />
        <strong>Tocando agora</strong>
      </header>

      {episode ? (
        <div className={styles.currentEpisode}>
          <Image
            width={592}
            height={592}
            src={episode.thumbnail}
            objectFit="cover"
            alt={episode.title}
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}

      <footer>
        <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider
                min={0}
                max={episode.duration}
                onChange={handleSeek}
                value={progress}
                trackStyle={{ backgroundColor: "#65c18c" }}
                railStyle={{ backgroundColor: "#ffbed8" }}
                handleStyle={{ borderColor: "#65c18c", borderWidth: 4 }}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>{episode ? episode.durationAsString : "00:00:00"}</span>
        </div>

        {episode && (
          <audio
            src={episode.url}
            autoPlay
            loop={isLooping}
            ref={audioRef}
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
            onEnded={handleEpisodeEnded}
            onLoadedMetadata={setupProgressListener}
          />
        )}

        <div className={styles.buttons}>
          <button
            type="button"
            disabled={!episode || episodeList.length === 1}
            onClick={toggleShuffle}
            className={isShuffling ? styles.isActive : ""}
          >
            <Image src={shufflePic} alt="Embaralhar" />
          </button>
          <button
            type="button"
            disabled={!episode || !hasPrevious}
            onClick={() => playPrevious()}
          >
            <Image src={playPrevPic} alt="Tocar anterior" />
          </button>
          <button
            type="button"
            className={styles.playButton}
            disabled={!episode}
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Image src={pausePic} alt="Pausar" />
            ) : (
              <Image src={playPic} alt="Tocar" />
            )}
          </button>
          <button
            type="button"
            disabled={!episode || !hasNext}
            onClick={() => playNext()}
          >
            <Image src={playNextPic} alt="Tocar próxima" />
          </button>
          <button
            type="button"
            disabled={!episode}
            onClick={toggleLoop}
            className={isLooping ? styles.isActive : ""}
          >
            <Image src={repeatPic} alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>
  );
}
