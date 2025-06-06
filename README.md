# meowApi

A simple fastify project to serv picture of cat 🐈

# Installation (standalone)
1. Clone the repo
```bash
git clone https://github.com/keyzox71/meowApi.git && cd meowApi
```
2. Install dependencies
```bash
pnpm install
```
4. Run it :D (there is also a `pnpm dev` to run the developement version)
```bash
pnpm start
```

# Installation (docker)
1. Pull the lastest image (a nightly tag also exist if you want)
```bash
docker pull ghcr.io/keyzox71/meowapi:latest
```
2. Run it :D
```bash
docker run -p 3000:3000 ghcr.io/keyzox71/meowapi
```
*you can pass the `/app/images` as a volumes it is where the images are stored*

# Installation (nix)
Soon...

# Usage
- **GET /** \
  Gives you a web page explaining the usage of the api
- **GET /list** \
  Return a list (json) of all id of served image :
  ```json
  [
    { "id": "0", "url": "/api/id?id=0" },
    { "id": "1", "url": "/api/id?id=1" }
  ]
  ```
- **GET /random** \
  Gives you a random image
- **GET /id?id={id from the list}** \
  Gives you the requested image (replace `{id from the list}` with a correcponding id)
  
# Contributing
Feel free to open issues or submit pull requests if you'd like to improve this project!

# License
This project is licensed under the MIT License
