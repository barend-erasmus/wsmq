# WSMQ Server (Linux using Systemd)

## Quick Install

`curl -s https://raw.githubusercontent.com/barend-erasmus/wsmq/master/scripts/linux-systemd-install.sh | bash`

## Manual Install

### Systemd Service File

Path: `/lib/systemd/system/wsmq.service`

```
[Unit]
Description=WSMQ Service

[Service]
Type=simple
ExecStart=/usr/bin/wsmq start --port 8080

[Install]
WantedBy=multi-user.target
```

### Start Service

`systemctl start wsmq`

### Start automatically on boot

`systemctl enable wsmq`