import { useEffect, useRef } from "react";
import Image from "next/image";
import usePlayer from "../../contexts/PlayerContext";
import Slider from "rc-slider";

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

  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    hasNext,
    hasPrevious,
    togglePlay,
    setPlayingState,
    playNext,
    playPrevious,
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
          <span>00:00</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider
                trackStyle={{ backgroundColor: "#65c18c" }}
                railStyle={{ backgroundColor: "#ffbed8" }}
                handleStyle={{ borderColor: "#65c18c", borderWidth: 4 }}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>00:00</span>
        </div>

        {episode && (
          <audio
            src={episode.url}
            autoPlay
            ref={audioRef}
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
          />
        )}

        <div className={styles.buttons}>
          <button type="button" disabled={!episode}>
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
          <button type="button" disabled={!episode}>
            <Image src={repeatPic} alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>
  );
}
