package com.ayoam.api.model;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponse {
    public String access_token;
    public AppUser user;
}
