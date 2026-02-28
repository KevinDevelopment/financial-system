up-prod:
	docker stack deploy -c docker-stack.yaml production --detach

down-prod:
	docker stack rm production