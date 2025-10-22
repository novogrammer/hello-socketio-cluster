SCALE?=3

# デタッチ起動
up:
	docker compose up -d --build --scale server=$(SCALE)

# フォアグラウンド起動（ログ出力あり）
upf:
	docker compose up --build --scale server=$(SCALE)

down:
	docker compose down -v

build:
	docker compose build

logs:
	docker compose logs -f

ps:
	docker compose ps