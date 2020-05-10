FROM mhart/alpine-node:10

ARG PORT=8080
ENV PORT=$PORT

# PM2
RUN yarn global add pm2

# Create app directory
RUN mkdir -p /app
WORKDIR /app

# Packages
COPY package.json yarn.lock /app/
RUN yarn install --frozen-lockfile

# Get other files
COPY . /app

# Expose port
EXPOSE $PORT

# Default startup execution command
CMD [ "sh", "-c", "pm2-docker /app/main.js" ]
