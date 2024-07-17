using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace MovieRankerAPI.Entities
{
    public class User
    {
        [BsonId]        
        [BsonElement("_id"), BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("user_name"), BsonRepresentation(BsonType.String)]
        public string? UserName { get; set; }

        [BsonElement("password"), BsonRepresentation(BsonType.String)]
        public string? Password { get; set; }

        [BsonElement("email"), BsonRepresentation(BsonType.String)]
        public string? Email { get; set; }

        [BsonElement("ranked_movies")]
        public List<RankedMovie>? RankedMovies { get; set; }

        [BsonElement("friends")]
        public List<string> Friends { get; set; } = new();
    }

    public class RankedMovie
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public string? MovieId { get; set; }

        [BsonElement("rank")]
        public int Rank { get; set; }
    }
}
