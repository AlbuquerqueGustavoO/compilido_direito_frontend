const fs = require("fs");
const { SitemapStream, streamToPromise } = require("sitemap");

const hostname = "https://compiladodeleis.com.br";

const links = [
  { url: "/", priority: 1.0 },

  { url: "/constitucional", priority: 0.9 },
  { url: "/administrativo", priority: 0.9 },
  { url: "/penal", priority: 0.9 },
  { url: "/civil", priority: 0.9 },
  { url: "/tributario", priority: 0.9 },

  { url: "/penal/processo-penal", priority: 0.8 },
  { url: "/penal/lei-maria-penha", priority: 0.8 },
  { url: "/penal/lei-de-drogas", priority: 0.8 },
  { url: "/penal/crimes-hediondos", priority: 0.8 },
  { url: "/penal/lei-organizacao-criminosa", priority: 0.8 },

  { url: "/civil/civil-codigo-processo", priority: 0.8 },
  { url: "/civil/civil-normas-direito-brasileiro", priority: 0.8 },

  { url: "/administrativo/administrativo-improbidade", priority: 0.8 },
  { url: "/administrativo/administrativo-servicosPublicos", priority: 0.8 },
  { url: "/administrativo/administrativo-processo", priority: 0.8 },
  { url: "/administrativo/administrativo-servidoresPublicos", priority: 0.8 },
  { url: "/administrativo/administrativo-parceriaPublico", priority: 0.8 },

  { url: "/quemsomos/apresentacao", priority: 0.5 },
  { url: "/quemsomos/referencias", priority: 0.5 },
];

async function generateSitemap() {
  const stream = new SitemapStream({ hostname });

  const xml = await streamToPromise(
    links.reduce((acc, link) => {
      stream.write(link);
      return acc;
    }, stream).end()
  ).then(data => data.toString());

  fs.writeFileSync("./dist/adv/sitemap.xml", xml);
}

generateSitemap();