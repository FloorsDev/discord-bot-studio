module.exports = {
  apps: [
    {
      name: "discord-bot",
      script: "./dist/index.js",
      instances: 1,
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
      },
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      restart_delay: 5000,
      max_restarts: 10,
      min_uptime: "10s",
      autorestart: true,
    },
    {
      name: "dashboard",
      script: "npm",
      args: "start",
      cwd: "./dashboard",
      instances: 1,
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
      },
      error_file: "./logs/dashboard_err.log",
      out_file: "./logs/dashboard_out.log",
      autorestart: true,
    },
  ],
};
