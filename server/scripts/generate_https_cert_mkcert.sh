#!/bin/bash

CERT_DIR="certs"
DOMAIN="localhost"
MKCERT_PATH=$(command -v mkcert 2>/dev/null)

mkdir -p "$CERT_DIR"

if [ -z "$MKCERT_PATH" ]; then
    echo "mkcert is not installed"
    echo "Install it here : https://github.com/FiloSottile/mkcert"
    exit 1
fi

mkcert -install

mkcert -key-file "$CERT_DIR/cert.key" -cert-file "$CERT_DIR/cert.crt" "$DOMAIN"

if [[ -f "$CERT_DIR/cert.key" && -f "$CERT_DIR/cert.crt" ]]; then
    echo "HTTPS certificat successfully created for '$DOMAIN' in '$CERT_DIR' folder"
else
    echo "Error while generating the certificat"
    exit 1
fi
