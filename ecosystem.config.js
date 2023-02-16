module.exports = {
  apps: [
    {
      script: "./src/app.ts",
      watch: ".",
      name: "app",
      args: "naver_map",
      instance: 1,
      exec_mode: "cluster",
    },
  ],

  deploy: {
    production: {
      user: "SSH_USERNAME",
      host: "SSH_HOSTMACHINE",
      ref: "origin/master",
      repo: "GIT_REPOSITORY",
      path: "DESTINATION_PATH",
      "pre-deploy-local": "",
      "post-deploy":
        "npm install && pm2 reload ecosystem.config.js --env production",
      "pre-setup": "",
    },
  },
};
