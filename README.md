# Projeto Banco de Dados Gerenciado - Node.js


### Nome: JOÃO VICTOR MORAES VIEIRA
### RA: 1091392123024


Este projeto demonstra:

- Inserts direcionados ao host primário (write)
- Selects direcionados à réplica (read)
- Script que gera inserts periódicos (500ms), e após cada insert realiza 10 selects individuais pelos ids anteriores
- API endpoints:
  - POST /produtos -> insere produto na instância primária
  - GET /produtos/:id -> lê produto da réplica

1. Copie `.env.example` para `.env` e configure as informações de conexão para PRIMARY e REPLICA.
2. Instale dependências:
   ```
   npm install
   ```
3. Para rodar o servidor API:
   ```
   npm start
   ```
4. Para rodar o script que gera inserts automaticamente:
   ```
   npm run inserter
   ```

O script `inserter.js` faz:

- Insere um produto com `criado_por` fixo (GRUPO_NOME).
- Após o insert imprime o id e os dados gravados.
- Em seguida realiza 10 selects individuais, dos ids anteriores (id-1, id-2, ...) e imprime o resultado de cada select.
