module.exports = {
  apps : [{
    name: 'LGCNS-GCSAPI',
    script: './bin/www',
    watch: false,
    instances: 3,
    exec_mode: "cluster",

    output: "./logs/pm2/console.log",
    error: "./logs/pm2/consoleError.log"
  }],
};
