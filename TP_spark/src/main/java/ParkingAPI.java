import com.google.gson.Gson;
import com.mongodb.DB;
import com.mongodb.MongoClient;

import static spark.Spark.get;
import static spark.Spark.staticFileLocation;

public class ParkingAPI {

    private static DB db;

    private static void initDB() {
        try {
            MongoClient mongoClient = new MongoClient( "localhost" , 27017 );
            db = mongoClient.getDB( "parks" );
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    public static void main(String[] args) {

        initDB();

        staticFileLocation("/static"); // Static files

        get("/parking", (request, response) -> {
            response.header("Access-Control-Allow-Origin", "*");
            return new Gson().toJson(Parking.getAllParking(db));
        });

        get("/parking/date/:date", (request, response) -> {
            response.header("Access-Control-Allow-Origin", "*");
            return new Gson().toJson(Parking.getParkingFromDate(db, request.params(":date")));
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

        get("/parking/information", (request, response) -> {
            response.header("Access-Control-Allow-Origin", "*");
            return new Gson().toJson(ParkingInformation.getAllParkingInformation(db));
        });
        /*get("/ParkingInformation/:parkingId", (request, response) -> {
            response.header("Access-Control-Allow-Origin", "*");
            return new Gson().toJson(ParkingInformation.getParkingInformation(db, request.params(":parkingId")));
        });*/
    }
}
