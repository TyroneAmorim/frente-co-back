FROM node


# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json ./

RUN npm install --force

# Bundle app source
COPY . .

EXPOSE 4000

CMD [ "npx ts-node", "/usr/src/app/src/main.ts" ]