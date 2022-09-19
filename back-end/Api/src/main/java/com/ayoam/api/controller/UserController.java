package com.ayoam.api.controller;

import com.ayoam.api.dto.AddRoleUserDto;
import com.ayoam.api.dto.UserDto;
import com.ayoam.api.dto.UserLoginDto;
import com.ayoam.api.model.AppUser;
import com.ayoam.api.model.AuthResponse;
import com.ayoam.api.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@RestController
public class UserController {
    private UserService userService;

    @Autowired
    public void setUserService(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/auth/register")
    public ResponseEntity<AppUser> registerUser(@RequestBody UserDto userDto){
        return new ResponseEntity<AppUser>(userService.registerUser(userDto), HttpStatus.CREATED);
    }

    @PostMapping("/auth/authenticate")
    public ResponseEntity<AuthResponse> generateToken(@RequestBody UserLoginDto userLoginDto,HttpServletResponse response) throws Exception {
        return new ResponseEntity<AuthResponse>(
            userService.generateToken(userLoginDto,response),
            HttpStatus.OK
        );
    }

    @GetMapping("/auth/refreshToken")
    public ResponseEntity<AuthResponse> refreshToken(HttpServletRequest request,HttpServletResponse response){
        return new ResponseEntity<AuthResponse>(
                userService.refreshToken(request,response),
                HttpStatus.OK
        );
    }

    @GetMapping ("/auth/logout")
    public ResponseEntity<HttpStatus> logout(HttpServletRequest request,HttpServletResponse response){

        userService.logout(response);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null){
            new SecurityContextLogoutHandler().logout(request, response, auth);
        }

        return new ResponseEntity<HttpStatus>(HttpStatus.OK);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<HttpStatus> deleteUser(@PathVariable Long id){
        userService.deleteUser(id);
        return new ResponseEntity<HttpStatus>(HttpStatus.OK);
    }

    @PutMapping("/users")
    public ResponseEntity<?> deleteUser(@RequestBody UserDto user){
        return new ResponseEntity<AppUser>(userService.updateUser(user),HttpStatus.OK);
    }

    @PostMapping("/admin/addRole")
    public ResponseEntity<AppUser> addRoleToUser(@RequestBody AddRoleUserDto addRoleUserDto){
        return new ResponseEntity<AppUser>(userService.addRoleToUser(addRoleUserDto),HttpStatus.OK);
    }
}
