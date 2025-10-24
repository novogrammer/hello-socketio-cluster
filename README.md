# Hello Socket.io Cluster

socket.ioのクラスターを試してみる。
投票システムも模擬してみる。

serverはスケールアウト構成、CaddyのSticky cookieで接続固定したいが、host名が必要なため、コンテナ数を変えるには設定の変更が必要。

クラウドサービスのロードバランサーならその辺りをうまく吸収できるかもしれない。


## 前提環境
Docker

## 立ち上げ

```bash
make up
```
または
```bash
make upf
```

## 終了
```bash
make down
```

## 確認
Caddyでリバースプロキシしたポートへアクセスする

http://localhost:8080


## 負荷テスト

`server/tools`に負荷テストのスクリプトを用意した。
