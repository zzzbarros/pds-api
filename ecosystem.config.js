module.exports = {
  apps: [
    {
      name: 'training-track',
      script: './dist/main.js',  // Caminho para o arquivo principal da sua aplicação
      instances: 2,  // Maximiza o uso de CPU
      exec_mode: 'cluster',  // Modo cluster para melhor performance e disponibilidade
      env: {
        NODE_ENV: 'production',  // Ambiente de produção
        PORT: 3000,
      },
    },
  ], 
};
