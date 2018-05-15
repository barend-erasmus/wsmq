# sudo curl -s https://raw.githubusercontent.com/barend-erasmus/wsmq/master/deploy.sh | bash -s

# Remove Directory
rm -rf /opt/wsmq

# Clone Repository
git clone https://github.com/barend-erasmus/wsmq.git /opt/repositories/wsmq

# Copy NGINX Configuration
cp  /opt/repositories/wsmq/nginx.conf /etc/nginx/sites-enabled/wsmq.conf

# Restart NGINX
systemctl restart nginx

# Install NPM Packages
npm install -g gulp
npm install -g typescript
npm install --prefix /opt/repositories/wsmq

# Build
npm run --prefix /opt/repositories/wsmq build

# Copy
cp -r /opt/repositories/wsmq/dist /opt/wsmq

# Remove Directory
rm -rf /opt/repositories/wsmq

# Install NPM Packages
npm install --prefix /opt/wsmq

# Run
pm2 start --name wsmq /opt/wsmq/message-queue-server.js