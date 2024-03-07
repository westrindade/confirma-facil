FROM node:20-alpine as node-build

WORKDIR /usr/src/app

# Install PM2 globally
RUN npm install --global pm2

# Credential for real time monitoring PM2 Plus
# ENV PM2_PUBLIC_KEY xxxxx
# ENV PM2_SECRET_KEY xxxxx


# Copy "package.json" and "package-lock.json" before other files
# Utilise Docker cache to save re-installing dependencies if unchanged

COPY . .

# Install dependencies
RUN npm install
RUN npm run build:prod

#RUN NODE_ENV=production npm run build:prod

#/usr/src/app/data

# Expose the listening port
EXPOSE 4200

# Launch app with PM2
#CMD [ "pm2-runtime", "start", "npm", "--", "start" ]
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
