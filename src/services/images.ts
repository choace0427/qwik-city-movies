import type { PersonMedia } from "./types";
import { Image, MovieDetails, TvDetails } from "./types3";

const imageBase = "https://image.tmdb.org/t/p";

type BackdropSizes = "w300" | "w780" | "w1280" | "original";

export const getBackdrop = (
  media: MovieDetails | TvDetails,
  size: BackdropSizes,
) => {
  return `${imageBase}/${size}${media.backdrop_path}`;
};

export const getBackdropSet = (media: MovieDetails | TvDetails) => {
  const sizes = ["w300", "w780"] as const;
  return sizes
    .map((size) => `${getBackdrop(media, size)} ${size.slice(1)}w`)
    .join(", ");
};

type PosterSizes = "92" | "154" | "185" | "342" | "500" | "780";

export const getPoster = (
  media: MovieDetails | TvDetails,
  size: PosterSizes,
) => {
  return `${imageBase}/w${size}${media.poster_path}`;
};

export const getPosterSet = (
  media: MovieDetails | TvDetails,
  maxSize: PosterSizes,
) => {
  const sizes = ["92", "154", "185", "342", "500", "780"] as const;
  return sizes
    .filter((size) => +size <= +maxSize)
    .map((size) => `${getPoster(media, size)} ${size}w`)
    .join(", ");
};

export const getImage = (image: Image, size: PosterSizes) => {
  return `${imageBase}/w${size}${image.file_path}`;
};

export const getImageSet = (image: Image, maxSize: PosterSizes) => {
  const sizes = ["92", "154", "185", "342", "500", "780"] as const;
  return sizes
    .filter((size) => +size <= +maxSize)
    .map((size) => `${getImage(image, size as PosterSizes)} ${size}w`)
    .join(", ");
};

type ProfileSizes = "w45" | "w185" | "h632" | "original";

export const getProfile = (media: PersonMedia, size: ProfileSizes) => {
  return `${imageBase}/${size}${media.profile_path}`;
};

export const getProfileSet = (media: PersonMedia) => {
  const sizes = ["w45", "w185"] as const;
  return sizes
    .map((size) => `${getProfile(media, size)} ${size.slice(1)}w`)
    .join(", ");
};
