FROM node:14

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# If you are building your code for production
#RUN npm ci --only=production
RUN npm install

# Bundle app source
COPY . /app

EXPOSE 5000
CMD [ "npm", "start" ]