import Image from "next/image";
import usePlayerContext from "../../contexts/PlayerContext";

import playingPic from "../../../public/playing.svg";
import shufflePic from "../../../public/shuffle.svg";
import playPrevPic from "../../../public/play-previous.svg";
import playPic from "../../../public/play.svg";
import playNextPic from "../../../public/play-next.svg";
import repeatPic from "../../../public/repeat.svg";

import styles from "./styles.module.scss";

export function Player() {
  const { episodeList, currentEpisodeIndex } = usePlayerContext();
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
            <div className={styles.emptySlider} />
          </div>
          <span>00:00</span>
        </div>

        <div className={styles.buttons}>
          <button type="button">
            <Image src={shufflePic} alt="Embaralhar" />
          </button>
          <button type="button">
            <Image src={playPrevPic} alt="Tocar anterior" />
          </button>
          <button type="button" className={styles.playButton}>
            <Image src={playPic} alt="Tocar" />
          </button>
          <button type="button">
            <Image src={playNextPic} alt="Tocar próxima" />
          </button>
          <button type="button">
            <Image src={repeatPic} alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>
  );
}
