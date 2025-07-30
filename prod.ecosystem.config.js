module.exports = {
  apps: [
    {
      name: 'prod-fe-pengusulan',
      script: 'npm',
      args: 'start',
      autorestart: true,
      watch: false,
    },
  ],
};