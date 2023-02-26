FROM node:14.20.0

WORKDIR /backend

# COPY package.json and package-lock.json files
COPY package.json .
COPY package-lock.json .

# COPY
COPY prisma ./prisma/
# COPY ENV variable
COPY .env ./
# COPY tsconfig.json file
COPY tsconfig.json ./

RUN npm install

COPY . .

RUN npx prisma generate

CMD ["npm", "run", "production"]