import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import * as Component from "./quartz/components"

const config = await loadQuartzConfig()
export default config

const layout = await loadQuartzLayout()

// Wstrzykujemy komponent RecentNotes z funkcją filtrującą bezpośrednio w TS,
// ponieważ pliki YAML nie obsługują wyrażeń lambda / funkcji.
if (layout.page?.afterBody) {
  layout.page.afterBody.push(
    Component.ConditionalRender({
      component: Component.RecentNotes({
        title: "Daily info",
        limit: 10,
        showTags: true,
        filter: (file) => file.slug!.startsWith("posty/daily/") && file.slug !== "index",
      }),
      condition: (page) => page.fileData.slug === "index",
    })
  )
}

export { layout }
