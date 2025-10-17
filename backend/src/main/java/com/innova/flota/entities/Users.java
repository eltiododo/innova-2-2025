package com.innova.flota.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;



@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "users")
public class Users {
    public enum Roles {
        ADMIN,
        USER,
        DRIVER
    }

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   @Column(unique = true, nullable = false)
   private Long id;
    
   @Column(name = "username")
   private String username;

   @Column(name = "email")
   private String email;

   @Column(name = "phone")
   private String phone;

   @Enumerated(EnumType.STRING)
   private Roles role;

}
