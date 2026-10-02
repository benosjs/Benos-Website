# Benos website

The public landing page for Benos, built with the published Benos packages.

## Run locally

Use Node.js `^22.18.0 || ^24.11.0 || >=26.0.0`.

```sh
npm install
npm run dev
```

## Verify and build

```sh
npm run typecheck
npm run build
npm run preview
```

The site source is in `src/`. It uses the public `@benosjs/core` and
`@benosjs/dom` APIs and links to the framework documentation in the main
repository.
