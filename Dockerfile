FROM node:lts as dependencies
WORKDIR /supabase-project
COPY package.json package-lock.json ./
RUN npm ci

FROM node:lts as builder
WORKDIR /supabase-project
COPY . .
COPY --from=dependencies /supabase-project/node_modules ./node_modules
RUN npm run build

FROM node:lts as runner
WORKDIR /supabase-project
ENV NODE_ENV production
# If you are using a custom next.config.js file, uncomment this line.
# COPY --from=builder /supabase-project/next.config.js ./
COPY --from=builder /supabase-project/public ./public
COPY --from=builder /supabase-project/.next ./.next
COPY --from=builder /supabase-project/node_modules ./node_modules
COPY --from=builder /supabase-project/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]