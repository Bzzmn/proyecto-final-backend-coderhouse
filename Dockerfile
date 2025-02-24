# Use Node.js official image as base
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app source code
COPY . .

# Create uploads directory if it doesn't exist
RUN mkdir -p ./src/public/uploads

# Expose port
EXPOSE 8080

# Start command
CMD ["npm", "start"] 