package com.proyecto.daw.model;

import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private String password;
}