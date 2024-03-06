# Use a imagem oficial do Node.js
FROM node:20

# Crie e defina o diretório de trabalho
WORKDIR /usr/src/app

# Copie os arquivos necessários para o contêiner
COPY dist/ ./
COPY package*.json ./
COPY data/bd_excel.xlsx ./

# Instale as dependências
RUN npm install --only=production

# Comando para iniciar a aplicação
CMD ["node", "dist/seu-arquivo-compilado.js"]
