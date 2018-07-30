# WSMQ Server (Linux using Systemd)

## Systemd Service File

Path: ` /lib/systemd/system/wsmq.service`

```
[Unit]
Description=WSMQ Service

[Service]
Type=simple
ExecStart=/usr/sbin/nginx

[Install]
WantedBy=multi-user.target
```

## Start Service

`systemctl start wsmq`

## Start automatically on boot

`systemctl enable wsmq`