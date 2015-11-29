import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBObject;

import java.util.List;

public class ParkingInformation {
    public static List<DBObject> getAllParkingInformation(DB db) {
        return db.getCollection("parkinformations").find().toArray();
    }

    public static List<DBObject>getParkingInformation(DB db, String id) {
        BasicDBObject whereQuery = new BasicDBObject();
        whereQuery.put("id", id);
        return db.getCollection("parkinformations").find(whereQuery).toArray();
    }
}
