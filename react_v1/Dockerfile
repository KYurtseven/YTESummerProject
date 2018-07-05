# base image
FROM node:9.6.1

# set working directory
WORKDIR /usr/src/app/react

# add `/usr/src/app/react/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/react/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /usr/src/app/react/package.json
RUN npm install --silent
RUN npm install react-scripts@1.1.1 -g --silent

# start app
CMD ["npm", "start"]