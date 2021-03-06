// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  // wsUrl : 'wss://234pgliu3m.execute-api.sa-east-1.amazonaws.com/production'
  wsUrl: 'wss://rp14k0xlxl.execute-api.sa-east-1.amazonaws.com/dev'
};
