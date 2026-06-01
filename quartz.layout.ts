import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [
    Component.PageTitle(),
  ],
  afterBody: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/psocik/",
//      "Discord Community": "https://discord.gg/cRFFHYye7t",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    // Ukrywamy tytuł artykułu na stronie głównej (bo "index" ma swój własny tekst/nagłówek)
    Component.ConditionalRender({
      component: Component.ArticleTitle(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    // Ukrywamy datę i czas czytania na stronie głównej
    Component.ConditionalRender({
      component: Component.ContentMeta(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.TagList(),
  ],
  left: [
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer(),
  ],
  right: [
    // Graf możesz zostawić lub ukryć – według uznania
    Component.Graph(), 
    // Ukrywamy spis treści na stronie głównej, bo i tak generuje się z nagłówków ostatnich postów
    Component.ConditionalRender({
      component: Component.DesktopOnly(Component.TableOfContents()),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.Backlinks(),
  ],
  // TUTAJ dodajemy sekcję afterBody, która odpala się POD główną treścią pliku index.md
  afterBody: [
    Component.ConditionalRender({
      component: Component.RecentNotes({
        title: "Daily info",
        limit: 10,         // Ile postów chcesz pokazać
        showTags: true,    // Czy pokazywać tagi przy postach
        filter: (file) => file.slug!.startsWith("posty/daily") && file.slug !== "index" // Ma się pokazać TYLKO na głównej
      }),
      condition: (page) => page.fileData.slug === "index", // Ma się pokazać TYLKO na głównej
    }),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer(),
  ],
  right: [],
}
