# sudo curl -s https://raw.githubusercontent.com/barend-erasmus/wsmq/master/setup.sh | bash -s

# Install NGINX
apt update
apt install -y nginx

# Configure NGINX
ufw allow 'Nginx Full'
systemctl enable nginx
systemctl start nginx

# Install node.js
curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -
apt-get install -y nodejs

# Install PM2
npm install -g pm2
pm2 startup