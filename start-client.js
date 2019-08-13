const args = [ 'start' ];
console.log(process.env);
const opts = { stdio: 'inherit', cwd: 'my-app', shell: true };
require('child_process').spawn('npm', args, opts);