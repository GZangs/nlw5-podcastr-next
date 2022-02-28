import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { api } from "../../services/api";
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";

type Episode = {
  id: string;
  title: string;
  members: string;
  thumbnail: string;
  publishedAt: string;
  url: string;
  duration: number;
  durationAsString: string;
  description: string;
};

type EpisodeProps = {
  episode: Episode;
};

interface Params extends ParsedUrlQuery {
  slug: string;
}

const Episode: NextPage<EpisodeProps> = ({ episode }) => {
  const router = useRouter();

  return <h1>{episode.title}</h1>;
};

// export const getStaticPaths: GetStaticPaths = async () => {

// }

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params as Params;
  const { data } = await api.get(`/episodes/${slug}`);

  const episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), "d MMM yy", {
      locale: ptBR,
    }),
    duration: Number(data.file.duration),
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
    description: data.description,
    url: data.file.url,
  };

  return {
    props: {},
    revalidate: 60 * 60 * 24, //24 hours
  };
};
