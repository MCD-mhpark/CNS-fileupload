module.exports = {
  apps : [{
    name: 'LGCNS-GCSAPI',
    script: './bin/www',
    watch: true,
     ignore_watch: [
            "logs"
        ],
    instances: 3,
    exec_mode: "cluster",

    output: "./logs/console.log",
    error: "./logs/consoleError.log"
  }],
};
