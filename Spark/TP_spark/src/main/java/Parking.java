import com.mongodb.*;

import org.bson.BSONObject;
import org.bson.types.ObjectId;

import java.util.*;

import static java.util.Arrays.asList;

public class Parking {

    public static List<DBObject>getAllParking(DB db) {
        return db.getCollection("parks").find().toArray();
    }

    public static List<DBObject> getParking(DB db, String id) {
        List<DBObject> dbObjectList = new ArrayList<>();
        BasicDBObject whereQuery = new BasicDBObject();
        whereQuery.put("id", id);
        /*String res = "";
        for(DBObject dbObject : db.getCollection("parks").find(whereQuery).toArray()) {
            Date date = new ObjectId(dbObject.get("_id").toString()).getDate();

            res += date.toString();
        }
        return res;*/

        /*String map ="function () {"+
                "if ( this.id == '" + id + "' ) "+
                "emit('size', {count:1});"+
                "}";

        String reduce = "function (key, values) { "+
                " total = 0; "+
                " for (var i in values) { "+
                " total += values[i].count; "+
                " } "+
                " return {count:total} }";*/

        /*String map ="function () {" +
                "if ( this.id == '" + id + "' ){ "+
                "var date = new Date( this.date );" +
                "var year = date.getFullYear();" +
                "var month = date.getMonth();" +
                "var day = date.getDate();" +
                "var hour = date.getHours();" +
                "emit(this, year+'-'+month+'-'+day+' '+hour+':00:00');}}";

        String reduce = "function (key, values) {" +
                "return {time:values};}";

        MapReduceCommand cmd = new MapReduceCommand(db.getCollection("parks"), map, reduce, null, MapReduceCommand.OutputType.INLINE, null);

        MapReduceOutput out = db.getCollection("parks").mapReduce(cmd);
        for (DBObject o : out.results()) {
            dbObjectList.add(o);
        }*/
        List<String> continentList = Collections.singletonList(id);
        DBObject match = new BasicDBObject("$match", new BasicDBObject("id", new BasicDBObject("$in", continentList)));

        DBObject projectFields = new BasicDBObject("parking", 1);
        projectFields.put("free", 1);
        projectFields.put("max", 1);
        projectFields.put("_id", 0);
        projectFields.put("year", "$new Date(this.date).getFullYear()");
        projectFields.put("month", "$new Date(this.date).getMonth()");
        projectFields.put("day", "$new Date(this.date).getDate()");
        projectFields.put("hour", "$new Date(this.date).getHours()");
        DBObject project = new BasicDBObject("$project", projectFields );

        DBObject groupFields = new BasicDBObject( "_id", "$parking");
        groupFields.put("free", new BasicDBObject( "$avg", "$free"));
        groupFields.put("max", new BasicDBObject( "$avg", "$max"));
        groupFields.put("total", new BasicDBObject( "$sum", "$free"));
        DBObject group = new BasicDBObject("$group", groupFields);

        for(DBObject dbObject : db.getCollection("parks").aggregate( match, project, group ).results())
            dbObjectList.add(dbObject);
        return dbObjectList;
    }

    /*public static List<Parking>getParking(DB db, String id) {
        BasicDBObject whereQuery = new BasicDBObject();
        whereQuery.put("id", id);
        return db.getCollection("parks").find(whereQuery).toArray().stream().map(dbObject -> new Parking(dbObject.get("id").toString(), dbObject.get("status").toString(), Integer.parseInt(dbObject.get("max").toString()), Integer.parseInt(dbObject.get("free").toString()), dbObject.get("date").toString())).collect(Collectors.toList());
    }*/
}

