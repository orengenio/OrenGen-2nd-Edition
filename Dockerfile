# Use nginx to serve static files
FROM nginx:alpine

# Copy custom nginx config
COPY marketing/nginx.conf /etc/nginx/conf.d/default.conf

# Copy all HTML files to nginx web root
COPY marketing/*.html /usr/share/nginx/html/

# Copy assets folder with images
COPY marketing/assets /usr/share/nginx/html/assets

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
