start:
	docker-compose up -d

rebuild:
	docker-compose up -d --build

rebuild-clean:
	docker-compose down -v
	docker-compose up -d --build

prisma-migrate:
	docker exec -it bot-structure-node sh -c "npx prisma migrate dev"
	docker exec -it bot-structure-node sh -c "npx prisma generate"

