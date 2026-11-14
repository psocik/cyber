import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import * as ExternalPlugin from "./quartz/plugins"

// 1. Nadpisanie opcji wtyczki (funkcja filter wymaga zapisu w TS, bo YAML jej nie przyjmie)
ExternalPlugin.RecentNotes({
  title: "Daily info",
  limit: 10,
  showTags: true,
  filter: (file) => file.slug!.startsWith("posty/daily/") && file.slug !== "index",
})

const config = await loadQuartzConfig()
export default config

// 2. Ładowanie layoutu (pozycja wtyczki i warunki są sterowane w quartz.config.yaml lub tutaj)
export const layout = await loadQuartzLayout()
