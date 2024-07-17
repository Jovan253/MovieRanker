﻿using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace MovieRankerAPI.Data
{
    public class MongoDbService
    {
        private readonly IConfiguration _configuration;
        private readonly IMongoDatabase? _database;
        
        public MongoDbService(IConfiguration configuration) {
            _configuration = configuration;
            var connectionString = _configuration.GetConnectionString("DbConnection");
            var mongoUrl = MongoUrl.Create(connectionString);
            var mongoClient = new MongoClient(mongoUrl);
            _database = mongoClient.GetDatabase(_configuration.GetConnectionString("DatabaseName"));
        }

        public IMongoDatabase? Database => _database;
    }
}
