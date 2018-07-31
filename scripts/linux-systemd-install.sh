wget -O /lib/systemd/system/wsmq.service "https://raw.githubusercontent.com/barend-erasmus/wsmq/master/scripts/wsmq.service"

systemctl start wsmq

systemctl enable wsmq
