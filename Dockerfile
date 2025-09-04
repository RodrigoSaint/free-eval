FROM denoland/deno:alpine-2.4.5 AS builder
WORKDIR /app
COPY . .
RUN deno task build
RUN deno compile --no-check --include static --include _fresh --include deno.json -A --output webapp web-main.ts

FROM debian:bookworm-slim
WORKDIR /app
COPY --from=builder /app/webapp .
RUN chmod +x ./webapp
EXPOSE 8000
CMD ["./webapp"]
