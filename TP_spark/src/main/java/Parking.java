import com.mongodb.*;

import java.util.*;

import static java.util.Arrays.asList;

public class Parking {

    /**
     * Récupère les informations des parking en effectuant une moyenne sur les places libres et les triant par ordre croissant selon la date
     * @param db la base mongoDB
     * @return la liste de documents contenant les informations des parking, moyennés par heure
     */
    public static List<DBObject> getAverageParking(DB db) {
        /**
         * Extraie les informations utiles pour effectuer l'aggregation
         */
        DBObject projectFields = new BasicDBObject("parking", 1);
        projectFields.put("id", "$id");
        projectFields.put("nom", "$name");
        projectFields.put("free", "$free");
        projectFields.put("max", "$max");
        projectFields.put("y", new BasicDBObject("$substr", new ArrayList<Object>(asList("$date", 0, 4))));
        projectFields.put("m", new BasicDBObject("$substr", new ArrayList<Object>(asList("$date", 5, 2))));
        projectFields.put("d", new BasicDBObject("$substr", new ArrayList<Object>(asList("$date", 8, 2))));
        projectFields.put("h", new BasicDBObject("$substr", new ArrayList<Object>(asList("$date", 11, 2))));
        DBObject project = new BasicDBObject("$project", projectFields );

        /**
         * Groupe les résultats par id et par heure et effectue une moyenne sur les heures pour les places libres
         */
        DBObject groupFields = new BasicDBObject( "_id", "$parking");
        BasicDBObject basicDBObject = new BasicDBObject();
        basicDBObject.put("year", "$y");
        basicDBObject.put("month", "$m");
        basicDBObject.put("day", "$d");
        basicDBObject.put("hour", "$h");
        basicDBObject.put("id", "$id");
        basicDBObject.put("name", "$nom");
        groupFields.put("_id", basicDBObject);
        groupFields.put("free", new BasicDBObject("$avg", "$free"));
        groupFields.put("max", new BasicDBObject("$max", "$max"));
        DBObject group = new BasicDBObject("$group", groupFields);

        /**
         * Trie les résultats par date
         */
        DBObject sortFields = new BasicDBObject();
        sortFields.put("_id.year", 1);
        sortFields.put("_id.month", 1);
        sortFields.put("_id.day", 1);
        sortFields.put("_id.hour", 1);
        DBObject sort = new BasicDBObject("$sort", sortFields);

        DBObject groupResFields = new BasicDBObject();
        BasicDBObject _idObjectField = new BasicDBObject();
        _idObjectField.put("id", "$_id.id");
        _idObjectField.put("name", "$_id.name");
        groupResFields.put("_id", _idObjectField);
        BasicDBObject listDbObject = new BasicDBObject();
        listDbObject.put("year", "$_id.year");
        listDbObject.put("month", "$_id.month");
        listDbObject.put("day", "$_id.day");
        listDbObject.put("hour", "$_id.hour");
        listDbObject.put("free", "$free");
        listDbObject.put("max", "$max");
        groupResFields.put("values", new BasicDBObject("$push", listDbObject));
        DBObject groupRes = new BasicDBObject("$group", groupResFields);


        List<DBObject> dbObjectList = new ArrayList<>();
        for(DBObject dbObject : db.getCollection("parks").aggregate(project, group, sort, groupRes).results())
            dbObjectList.add(dbObject);
        return dbObjectList;
    }

    public static List<DBObject> getParkingFromDate(DB db, String date) {
        /**
         * Extraie les informations utiles pour effectuer l'aggregation
         */
        DBObject projectFields = new BasicDBObject("parking", 1);
        projectFields.put("id", "$id");
        projectFields.put("nom", "$name");
        projectFields.put("free", "$free");
        projectFields.put("max", "$max");
        projectFields.put("y", new BasicDBObject("$substr", new ArrayList<Object>(asList("$date", 0, 4))));
        projectFields.put("m", new BasicDBObject("$substr", new ArrayList<Object>(asList("$date", 5, 2))));
        projectFields.put("d", new BasicDBObject("$substr", new ArrayList<Object>(asList("$date", 8, 2))));
        projectFields.put("h", new BasicDBObject("$substr", new ArrayList<Object>(asList("$date", 11, 2))));
        DBObject project = new BasicDBObject("$project", projectFields );

        DBObject matchFields = new BasicDBObject();
        matchFields.put("y", new BasicDBObject("$eq", date.substring(0, 4)));
        matchFields.put("m", new BasicDBObject("$eq", date.substring(5, 7)));
        matchFields.put("d", new BasicDBObject("$eq", date.substring(8, 10)));
        //matchFields.put("h", new BasicDBObject("$gt", "0").append("$lt", "10"));
        DBObject match = new BasicDBObject("$match", matchFields);

        /**
         * Groupe les résultats par id et par heure et effectue une moyenne sur les heures pour les places libres
         */
        DBObject groupFields = new BasicDBObject( "_id", "$parking");
        BasicDBObject basicDBObject = new BasicDBObject();
        basicDBObject.put("year", "$y");
        basicDBObject.put("month", "$m");
        basicDBObject.put("day", "$d");
        basicDBObject.put("hour", "$h");
        basicDBObject.put("id", "$id");
        basicDBObject.put("name", "$nom");
        groupFields.put("_id", basicDBObject);
        groupFields.put("free", new BasicDBObject("$avg", "$free"));
        DBObject group = new BasicDBObject("$group", groupFields);

        /**
         * Trie les résultats par date
         */
        DBObject sortFields = new BasicDBObject();
        sortFields.put("_id.year", 1);
        sortFields.put("_id.month", 1);
        sortFields.put("_id.day", 1);
        sortFields.put("_id.hour", 1);
        DBObject sort = new BasicDBObject("$sort", sortFields);

        DBObject groupResFields = new BasicDBObject();
        BasicDBObject _idObjectField = new BasicDBObject();
        _idObjectField.put("id", "$_id.id");
        _idObjectField.put("name", "$_id.name");
        groupResFields.put("_id", _idObjectField);
        BasicDBObject listDbObject = new BasicDBObject();
        listDbObject.put("year", "$_id.year");
        listDbObject.put("month", "$_id.month");
        listDbObject.put("day", "$_id.day");
        listDbObject.put("hour", "$_id.hour");
        listDbObject.put("free", "$free");
        listDbObject.put("max", "$_id.max");
        groupResFields.put("values", new BasicDBObject("$push", listDbObject));
        DBObject groupRes = new BasicDBObject("$group", groupResFields);

        List<DBObject> dbObjectList = new ArrayList<>();
        for(DBObject dbObject : db.getCollection("parks").aggregate(project, match, group, sort, groupRes).results())
            dbObjectList.add(dbObject);
        return dbObjectList;
    }

    /**
     * Récupère les informations des derniers parkings enregistrés en base de données
     * @param db la base mongoDB
     * @return la liste de documents contenant les informations
     */
    public static List<DBObject> getLastParking(DB db) {
        return db.getCollection("parks").find().sort(new BasicDBObject("date", -1)).limit(db.getCollection("parkinformations").find().count()).toArray();
    }

    /**
     * Récupère la capacite maximale des parkings
     * @param db la base mongoDB
     * @return la liste de documents contenant les informations
     */
    public static List<DBObject> getMaxParking(DB db) {
        List<DBObject> dbObjectList = new ArrayList<>();

        DBObject projectFields = new BasicDBObject("parking", 1);
        projectFields.put("nom", "$name");
        projectFields.put("max", "$max");
        DBObject project = new BasicDBObject("$project", projectFields );

        DBObject groupFields = new BasicDBObject( "_id", "$parking");
        BasicDBObject basicDBObject = new BasicDBObject();
        basicDBObject.put("id", "$id");
        basicDBObject.put("name", "$nom");
        groupFields.put("_id", basicDBObject);
        groupFields.put("max", new BasicDBObject("$max", "$max"));
        DBObject group = new BasicDBObject("$group", groupFields);

        for(DBObject dbObject : db.getCollection("parks").aggregate(project, group).results())
            dbObjectList.add(dbObject);
        return dbObjectList;
    }

    public static List<DBObject> getAllParking(DB db) {
        return db.getCollection("parks").find().toArray();
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

