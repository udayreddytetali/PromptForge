module.exports = {
  apps: [
    {
      name: 'promptforge-backend',
      script: '/var/www/PromptForge/backend/server.js',
      cwd: '/var/www/PromptForge/backend',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      watch: false,
      autorestart: true,
      restart_delay: 3000,
      max_restarts: 10,
      error_file: '/var/log/promptforge/backend-error.log',
      out_file: '/var/log/promptforge/backend-out.log',
      log_file: '/var/log/promptforge/backend-combined.log',
      time: true
    }
  ]
};
