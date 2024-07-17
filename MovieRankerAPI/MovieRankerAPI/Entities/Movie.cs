using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace MovieRankerAPI.Entities
{
    public class Movie
    {
        [BsonId]
        [BsonElement("_id"), BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("title"), BsonRepresentation(BsonType.String)]
        public string? Title { get; set; }

        [BsonElement("description"), BsonRepresentation(BsonType.String)]
        public string? Description { get; set; }

        [BsonElement("poster_url"), BsonRepresentation(BsonType.String)]
        public string? PosterUrl { get; set; }

        [BsonElement("genre"), BsonRepresentation(BsonType.String)]
        public string? Genre { get; set; }

    }
}
