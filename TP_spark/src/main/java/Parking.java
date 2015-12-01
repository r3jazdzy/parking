import com.mongodb.*;

import java.util.*;

import static java.util.Arrays.asList;

public class Parking {

    public static List<DBObject> getAllParking(DB db) {
        List<DBObject> dbObjectList = new ArrayList<>();

        DBObject projectFields = new BasicDBObject("parking", 1);
        projectFields.put("id", "$id");
        projectFields.put("nom", "$name");
        projectFields.put("free", "$free");
        projectFields.put("max", "$max");
        projectFields.put("y", new BasicDBObject("$substr", new ArrayList(asList("$date", 0, 4))));
        projectFields.put("m", new BasicDBObject("$substr", new ArrayList(asList("$date", 5, 2))));
        projectFields.put("d", new BasicDBObject("$substr", new ArrayList(asList("$date", 8, 2))));
        projectFields.put("h", new BasicDBObject("$substr", new ArrayList(asList("$date", 11, 2))));
        DBObject project = new BasicDBObject("$project", projectFields );

        DBObject groupFields = new BasicDBObject( "_id", "$parking");
        BasicDBObject basicDBObject = new BasicDBObject();
        basicDBObject.put("year", "$y");
        basicDBObject.put("month", "$m");
        basicDBObject.put("day", "$d");
        basicDBObject.put("hour", "$h");
        basicDBObject.put("id", "$id");
        basicDBObject.put("name", "$nom");
        basicDBObject.put("max", "$max");
        groupFields.put("_id", basicDBObject);
        groupFields.put("free", new BasicDBObject("$avg", "$free"));
        DBObject group = new BasicDBObject("$group", groupFields);

        DBObject sortFields = new BasicDBObject("date", 1);
        DBObject sort = new BasicDBObject("$sort", sortFields);

        for(DBObject dbObject : db.getCollection("parks").aggregate(project, sort, group).results())
            dbObjectList.add(dbObject);
        return dbObjectList;
    }

    public static List<DBObject> getLastParking(DB db) {
        return db.getCollection("parks").find().sort(new BasicDBObject("date", -1)).limit(db.getCollection("parkinformations").find().count()).toArray();
    }

    public static List<DBObject> getMaxParking(DB db) {
        List<DBObject> dbObjectList = new ArrayList<>();

        DBObject projectFields = new BasicDBObject("parking", 1);
        projectFields.put("nom", "$name");
        projectFields.put("max", "$max");
        DBObject project = new BasicDBObject("$project", projectFields );

        DBObject groupFields = new BasicDBObject( "_id", "$parking");
        BasicDBObject basicDBObject = new BasicDBObject();
        basicDBObject.put("name", "$nom");
        basicDBObject.put("max", "$max");
        groupFields.put("_id", basicDBObject);
        DBObject group = new BasicDBObject("$group", groupFields);

        for(DBObject dbObject : db.getCollection("parks").aggregate(project, group).results())
            dbObjectList.add(dbObject);
        return dbObjectList;
    }

    /*public static List<DBObject> getParking(DB db, String id) {
        List<DBObject> dbObjectList = new ArrayList<>();

        ArrayList $year = new ArrayList();
        $year.add("$date");
        $year.add(0);
        $year.add(4);

        ArrayList $month = new ArrayList();
        $month.add("$date");
        $month.add(5);
        $month.add(2);

        ArrayList $day = new ArrayList();
        $day.add("$date");
        $day.add(8);
        $day.add(2);

        ArrayList $hour = new ArrayList();
        $hour.add("$date");
        $hour.add(11);
        $hour.add(2);


        List<String> continentList = Collections.singletonList(id);
        DBObject match = new BasicDBObject("$match", new BasicDBObject("id", new BasicDBObject("$in", continentList)));

        DBObject projectFields = new BasicDBObject("parking", 1);
        projectFields.put("id", "$id");
        projectFields.put("nom", "$name");
        projectFields.put("free", "$free");
        projectFields.put("max", "$max");
        projectFields.put("y", new BasicDBObject("$substr", $year));
        projectFields.put("m", new BasicDBObject("$substr",$month));
        projectFields.put("d", new BasicDBObject("$substr",$day));
        projectFields.put("h", new BasicDBObject("$substr",$hour));
        DBObject project = new BasicDBObject("$project", projectFields );

        DBObject groupFields = new BasicDBObject( "_id", "$parking");
        BasicDBObject basicDBObject = new BasicDBObject();
        basicDBObject.put("year", "$y");
        basicDBObject.put("month", "$m");
        basicDBObject.put("day", "$d");
        basicDBObject.put("hour", "$h");
        basicDBObject.put("id", "$id");
        basicDBObject.put("name", "$nom");
        basicDBObject.put("max", "$max");
        groupFields.put("_id", basicDBObject);
        groupFields.put("free", new BasicDBObject("$avg", "$free"));
        DBObject group = new BasicDBObject("$group", groupFields);
        for(DBObject dbObject : db.getCollection("parks").aggregate(match, project, group).results())
            dbObjectList.add(dbObject);
        return dbObjectList;
    }*/
}

