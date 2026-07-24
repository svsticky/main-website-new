FROM node:26-alpine

# Has to be called server for astro to work
WORKDIR /server

COPY dist/server .

CMD node entry.mjs