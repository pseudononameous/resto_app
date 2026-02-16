FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --omit=dev

COPY . .
EXPOSE 8000

ENV NODE_ENV=production
ENV PORT=8000

CMD ["node", "app.js"]
