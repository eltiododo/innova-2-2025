package com.innova.flota.repositories;

import com.innova.flota.entities.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsersRepository extends JpaRepository<Users, Long> {
    Optional<Users> findByEmail(String email);

    Optional<Users> findByUsername(String username);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);
}
