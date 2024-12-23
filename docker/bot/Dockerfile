FROM node:21
RUN apt-get update

# Create app directory
RUN mkdir -p /home/node/node_modules && chown -R node:node /home/node
WORKDIR /home/node

# Copy app source
COPY --chown=node:node . .

# Switch to node user
USER node

# Install app dependencies and download translation files
RUN npm install
ARG CACHEBUST=1

# Start the app
ENTRYPOINT ["npm", "run", "entrypoint"]