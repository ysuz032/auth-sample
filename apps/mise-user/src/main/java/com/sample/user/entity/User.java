package com.sample.user.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.Map;

@Entity
@Table(name = "users")
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String name;
    private String password;

    public Map<String, String> toMap() {
        Map<String, String> data = new HashMap<>();
        data.put("id", this.id != null ? this.id.toString() : null);
        data.put("email", this.email);
        data.put("name", this.name);
        data.put("password", this.password);
        return data;
    }
}
