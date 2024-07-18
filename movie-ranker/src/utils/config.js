const config = {
    production: {
      apiUrl: 'https://movierankerapi-d6fdeba4ezf5bkck.uksouth-01.azurewebsites.net'
    },
    development: {
      apiUrl: 'http://localhost:5098'
    }
  };
  
// let environment = 'development';
let environment = 'production';

if (process.env.NODE_ENV == "production"){
    environment = 'production'
}

export default config[environment];