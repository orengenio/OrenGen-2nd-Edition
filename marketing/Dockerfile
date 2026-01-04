# Use nginx to serve static files
FROM nginx:alpine

# Copy all HTML files to nginx web root
COPY *.html /usr/share/nginx/html/

# Copy wordpress folder for assets if needed
COPY wordpress /usr/share/nginx/html/wordpress/ 2>/dev/null || true

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
