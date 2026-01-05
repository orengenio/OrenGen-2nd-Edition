# Use nginx to serve static files
FROM nginx:alpine

# Copy all HTML files to nginx web root
COPY *.html /usr/share/nginx/html/

# Copy assets folder
COPY assets /usr/share/nginx/html/assets/

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
