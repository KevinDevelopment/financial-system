#!/bin/bash

set -e

STACK_NAME="financial_stack"

echo "🔐 Criando/Atualizando secrets..."

for file in ./secrets/*.txt; do
  secret_name=$(basename "$file" .txt)

  if docker secret inspect "$secret_name" >/dev/null 2>&1; then
    echo "♻️  Atualizando secret: $secret_name"
    docker secret rm "$secret_name"
  else
    echo "➕ Criando secret: $secret_name"
  fi

  docker secret create "$secret_name" "$file"
done

