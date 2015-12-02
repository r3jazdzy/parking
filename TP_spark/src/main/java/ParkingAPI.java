import com.google.gson.Gson;
import com.mongodb.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static spark.Spark.get;

/**
 *
 */
public class ParkingAPI {

    /**
     *
     */
    public static Logger logger = LoggerFactory.getLogger(ParkingAPI.class);

    /**
     *
     */
    private static DB db;

    /**
     *
     */
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

    /**
     *
     * @param args
     */
    public static void main(String[] args) {

        initDB();

        get("/parking", (request, response) -> {
            response.header("Access-Control-Allow-Origin", "*");
            return new Gson().toJson(Parking.getAllParking(db));
        });

        get("/parking/last", (request, response) -> {
            response.header("Access-Control-Allow-Origin", "*");
            return new Gson().toJson(Parking.getLastParking(db));
        });

        get("/parking/max", (request, response) -> {
            response.header("Access-Control-Allow-Origin", "*");
            return new Gson().toJson(Parking.getMaxParking(db));
        });

        /*get("/parking/:parkingId", (request, response) -> {
            response.header("Access-Control-Allow-Origin", "*");
            return new Gson().toJson(Parking.getParking(db, request.params(":parkingId")));
        });*/

        get("/parkingInformation", (request, response) -> {
            response.header("Access-Control-Allow-Origin", "*");
            return new Gson().toJson(ParkingInformation.getAllParkingInformation(db));
        });
        /*get("/ParkingInformation/:parkingId", (request, response) -> {
            response.header("Access-Control-Allow-Origin", "*");
            return new Gson().toJson(ParkingInformation.getParkingInformation(db, request.params(":parkingId")));
        });*/
    }
}
