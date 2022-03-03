import "../styles/global.scss";

import type { AppProps } from "next/app";

import { Header } from "../components/Header";
import { Player } from "../components/Player";
import usePlayer, {
  PlayerContextProvider,
} from "../contexts/PlayerContext";

import styles from "../styles/app.module.scss";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PlayerContextProvider>
      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerContextProvider>
  );
}

export default MyApp;
