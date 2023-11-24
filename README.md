# ReFa Reader Template

> ⚠️ Important

Compared to the template the `@sveltejs/adapter-static` is used to deploy a static build. All the markdown urls have to be specified in `svelte.config.js`.

![Screenshot 2023-11-23 at 12 41 49](https://github.com/uclab-potsdam/refa-reader-template/assets/20107875/2677533b-edee-42a7-b47b-0cf91a23dc50)


An interactive visualization that juxtaposes essays and graphs. 
It allows readers to browse items from Omeka-S-based collections, by accessing them through a curated selection of texts designed to provide better understanding, combining editorial approaches with free exploration and user-driven granularity.

## Installation
### Project setup

1. In Terminal, go to your production folder:
```
cd path/to/my/folder
```

2. Clone this repository
```
git clone https://github.com/uclab-potsdam/refa-reader-template.git NAME-OF-MY-FOLDER
cd NAME-OF-MY-FOLDER
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

5. Preview the production build with `npm run preview`.

## Configuration

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
To Setup the visualisation it is needed to customise the setup file in the `src/setup.json`. <br>


```
{
    "title": "The title of the Website",
    "api": "https://exampe.com/api", // The link to a Omeka S Api
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
        {
            "key": "Documentation",
            "props": [
                "is documented in",
                "incorporates"
            ]
        }
    ]
}
``

