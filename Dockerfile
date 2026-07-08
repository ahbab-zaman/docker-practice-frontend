# ======================
# STAGE-1 "Builder" turn your react/TS files into static HTML/CSS/JS files
# ======================

FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first (Docker layer caching)
COPY package*.json ./
RUN npm install

# Copy the rest of the project
COPY . .

# Run Vite's production build — creates a "dist/" folder of static files.
# This reads VITE_API_URL from .env at this point, since Vite bakes it
# into the JS bundle here (not at container start time).
RUN npm run build


# =========================================
# STAGE 2: "Runtime" — serves the built static files
# =========================================

# Fresh, small Node image again — we're not using any of Stage 1's
# node_modules or source files, just installing one tiny static-file server
FROM node:20-alpine

WORKDIR /app

# Install "serve" globally — a minimal static file server maintained by Vercel.
# This is the only dependency this stage needs.
RUN npm install -g serve

# Copy ONLY the built static output from Stage 1
COPY --from=builder /app/dist ./dist

# Expose port 3000 to the host so we can access the app
EXPOSE 3000

# Start the static server, pointing at the dist/ folder.
# "-s" enables SPA mode — any unmatched route falls back to index.html,
# which is what makes React Router work correctly on refresh/direct visits.
CMD ["serve", "-s", "dist", "-l", "3000"]