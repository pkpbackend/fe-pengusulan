module.exports = {
  apps: [
    {
      name: 'staging-fe-pengusulan',
      script: 'npm',
      args: 'start',
      autorestart: true,
      watch: false,
    },
  ],
};