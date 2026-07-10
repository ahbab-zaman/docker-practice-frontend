FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# NEW: Accept VITE_API_URL as a build argument, passed in from outside
# (either your local terminal with --build-arg, or GitHub Actions)
ARG VITE_API_URL

# NEW: Turn that build argument into an actual environment variable
# that Vite can read during the build — this is what Vite actually checks
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build


FROM node:20-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]