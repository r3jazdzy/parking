import com.google.gson.Gson;
import com.mongodb.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static spark.Spark.get;

public class ParkingAPI {

    public static Logger logger = LoggerFactory.getLogger(ParkingAPI.class);

    private static DB db;

    private static void initDB() {
        try {
            MongoClient mongoClient = new MongoClient( "localhost" , 27017 );
            db = mongoClient.getDB( "parks" );
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
    }

    /*private static void closeDb() {
        try {
            conn.close();
        } catch (Exception e) {
            System.out.println(e.getMessage());
            logger.error(e.getMessage(), e);
        }
    }*/

    public static void main(String[] args) {

        initDB();

        get("/ParkingList", (request, response) -> new Gson().toJson(Parking.getAllParking(db)));
        get("/Parking/:parkingId", (request, response) -> new Gson().toJson(Parking.getParking(db, request.params(":parkingId"))));

        get("/ParkingInformationList", (request, response) -> new Gson().toJson(ParkingInformation.getAllParkingInformation(db)));
        get("/ParkingInformation/:parkingId", (request, response) -> new Gson().toJson(ParkingInformation.getParkingInformation(db, request.params(":parkingId"))));

    }
}
