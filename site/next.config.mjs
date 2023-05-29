import nextMDX from '@next/mdx';
import rehypeToc from 'rehype-toc';
import rehypeSlug from 'rehype-slug';
import rehypeExternalLinks from 'rehype-external-links';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // active le mode strict pour détecter le problèmes en dev
  reactStrictMode: true,
  // active la minification
  swcMinify: true,
  experimental: {
    // utilise le dossier "app" plutôt que "pages" pour le routage
    appDir: true,
    // permet le chargement de nivo
    esmExternals: 'loose',
  },
  // surcharge la config webpack
  webpack: config => {
    // pour le chargement des fontes au format woff2
    config.module.rules.push({
      test: /\.woff2$/,
      type: 'asset/resource',
    });

    return config;
  },
};

// ajoute le traitement des fichiers mdx
const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeExternalLinks,
        {rel: ['noreferrer', 'noopener'], target: '_blank'},
      ],
      [rehypeToc, {cssClasses: {toc: 'md-toc'}, headings: ['h1', 'h2']}],
    ],
  },
});

export default withMDX(nextConfig);
