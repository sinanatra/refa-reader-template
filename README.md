# ReFa Reader Template

> ⚠️ By default the refa-reader works with Omeka-S. If you want to work with a custom JSON-LD file, use this [repository](https://github.com/sinanatra/refa-reader-template-local)


![refa](https://github.com/sinanatra/refa-reader-template/assets/20107875/10b7a524-8e54-4b36-a704-fa1e4d7efac8)


An interactive visualization that juxtaposes essays and graphs. 
It allows readers to browse JSON-LD data (It works with Omeka-S based collections), by accessing them through a curated selection of texts designed to provide better understanding, combining editorial approaches with free exploration and user-driven granularity.

## Installation
### Project setup

1. In the Terminal, go to your production folder:

```
cd path/to/my/folder
```

2. Clone this repository
```
git clone https://github.com/sinanatra/refa-reader-template.git
cd refa-reader-template
```

3. Install dependencies with yarn
```
yarn
```

4. Run and build the development environment.
```
yarn dev
yarn build
```

5. Preview the production build with `yarn preview`. 

6. Deploy to Github with : `yarn deploy`

## Configuration
> ⚠️ Compared to the [refa-reader](https://github.com/uclab-potsdam/refa-reader) the `@sveltejs/adapter-static` is used to deploy a static build.

> All the markdown urls are crawled in the `src/routes/[slug]/+page.js`:

### Markdowns

Essays need to be inserted inside the `src/route/texts/` folder.<br>
Every markdown contains metadata to customize the layout:

```
---
title: The title of the essay.
date: "2023-12-14"
color: "blue"
author: "Name of the Author"
isPublic: true // false
lang: en
description: "The description which appears in the home page"
cover: "https://example.com/image.jpg"
---
```

### Setup
To configure the graph visualisation it is needed to customise the setup file in the `src/setup.json`. <br>


```
{
    "title": "The title of the Website",
    "api": "https://exampe.com/api", // The link to a Omeka S Api
    "local": "db.json", // Alternatively, the path to the JSON-LD
     "paths": { // customise the property for the resource title and images
        "title": "o:title", 
        "img": [
            "thumbnail_display_urls",
            "large"
        ]
    },
    "publicSite": "", // The link of an Omeka-S collection 
    "languages": ["en"],
    "description": {
        "en": "Text to render in the homepage"
    }, 
    "mainCategories": [
        // It is possible to customise the column layout by specifing a category and properties as a js Object. 
        {
            "key": "Category title",
            "props": [
                "is refered to it",
                "shows features of",
            ]
        },
       ...
    ],
    "descriptionSeo": "metadata field for SEO",
    "imageSeo": "image path SEO"

}
```
