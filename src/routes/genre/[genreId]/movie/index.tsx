import { component$, useContext, useStore } from "@builder.io/qwik";
import { action$, DocumentHead, loader$ } from "@builder.io/qwik-city";
import { z } from "zod";
import { MediaGrid } from "~/modules/MediaGrid/MediaGrid";
import { ContainerContext } from "~/routes/context";
import { getMediaByGenre } from "~/services/tmdb";
import { ProductionMedia } from "~/services/types";
import { paths } from "~/utils/paths";

export const getAction = action$((form, event) => {
  const parseResult = z
    .object({
      genreId: z.coerce.number().min(0).step(1),
      page: z.coerce.number().min(1).step(1),
    })
    .safeParse({
      ...event.params,
      page: form.get("page") || 1,
    });

  if (!parseResult.success) {
    throw event.redirect(302, paths.notFound);
  }

  return getMediaByGenre({
    genre: parseResult.data.genreId,
    media: "movie",
    page: parseResult.data.page,
  });
});

export const getContent = loader$((event) => {
  const parseResult = z
    .object({ genreId: z.coerce.number().min(0).step(1) })
    .safeParse(event.params);

  if (!parseResult.success) {
    throw event.redirect(302, paths.notFound);
  }

  return getMediaByGenre({
    genre: parseResult.data.genreId,
    media: "movie",
    page: 1,
  });
});

export default component$(() => {
  const container = useContext(ContainerContext);

  const movies = getContent.use();
  const action = getAction.use();

  const store = useStore({
    currentPage: 1,
    results: [] as ProductionMedia[],
  });

  return (
    <div class="flex flex-col">
      <h1 class="px-8 pt-4 text-4xl">{`Movie Genre: ${
        movies?.value.genre?.name || "Not defined"
      }`}</h1>
      <MediaGrid
        collection={[...movies.value.results, ...store.results]}
        currentPage={store.currentPage}
        pageCount={movies.value.total_pages || 1}
        parentContainer={container.value}
        onMore$={async () => {
          await action.execute({ page: `${store.currentPage + 1}` });
          const newMedia = action.value?.results || [];
          store.results.push(...newMedia);
          store.currentPage += 1;
        }}
      />
    </div>
  );
});

export const head: DocumentHead = (event) => {
  const { genre } = event.getData(getContent);
  return genre ? { title: `${genre.name} Tv Shows - Qwik City Movies` } : {};
};
