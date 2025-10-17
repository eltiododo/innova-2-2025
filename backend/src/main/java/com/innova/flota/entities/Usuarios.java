package com.innova.flota.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;



@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name="usuarios")
public class Usuarios {
    public enum Roles{
        ADMIN,
        USER,
        DRIVER
    }

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   @Column(unique = true, nullable = false)
    Long id;

    @Column(name="username")
    String username;

    @Column(name="email")
    String email;

    @Column(name="phone")
    String phone;

    @Enumerated(EnumType.STRING)
    Roles role;

}
