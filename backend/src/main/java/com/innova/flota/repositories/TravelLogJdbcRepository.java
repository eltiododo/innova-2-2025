package com.innova.flota.repositories;

import com.innova.flota.entities.TravelLog;
import org.postgresql.util.PGobject;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;

@Repository
public class TravelLogJdbcRepository {

    private final DataSource dataSource;

    public TravelLogJdbcRepository(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public TravelLog save(TravelLog log) {
        String sql = "INSERT INTO travel_log (vehicle_id, start_position, end_position, avg_speed, avg_acceleration, state, created_at) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id, created_at";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setLong(1, log.getVehicle().getId());

            PGobject start = new PGobject();
            start.setType("point");
            start.setValue("(" + log.getStartPosition().getX() + "," + log.getStartPosition().getY() + ")");
            ps.setObject(2, start);

            PGobject end = new PGobject();
            end.setType("point");
            end.setValue("(" + log.getEndPosition().getX() + "," + log.getEndPosition().getY() + ")");
            ps.setObject(3, end);

            if (log.getAvgSpeed() != null) ps.setFloat(4, log.getAvgSpeed());
            else ps.setNull(4, Types.REAL);

            if (log.getAvgAcceleration() != null) ps.setFloat(5, log.getAvgAcceleration());
            else ps.setNull(5, Types.REAL);

            if (log.getState() != null) ps.setString(6, log.getState());
            else ps.setNull(6, Types.VARCHAR);

            Timestamp created = log.getCreatedAt() != null ? log.getCreatedAt() : new Timestamp(System.currentTimeMillis());
            ps.setTimestamp(7, created);

            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    log.setId(rs.getLong("id"));
                    log.setCreatedAt(rs.getTimestamp("created_at"));
                    return log;
                }
            }

            throw new RuntimeException("Failed to insert TravelLog");
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}
