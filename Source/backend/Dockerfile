FROM node:14.20.0 as build

WORKDIR /backend

COPY package.json .
COPY package-lock.json .
COPY prisma ./prisma/
COPY .env ./
COPY tsconfig.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:14.20.0

WORKDIR /backend

COPY .env .
COPY package.json .
COPY --from=build /backend/dist ./dist
COPY --from=build /backend/node_modules ./node_modules
COPY --from=build /backend/prisma ./prisma
COPY src/public ./dist/public
COPY src/cert ./dist/cert

CMD ["npm", "run", "production"]