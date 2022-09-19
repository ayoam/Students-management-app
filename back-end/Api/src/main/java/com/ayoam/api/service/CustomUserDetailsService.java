package com.ayoam.api.service;

import com.ayoam.api.model.AppUser;
import com.ayoam.api.model.Authority;
import com.ayoam.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private UserRepository userRepository;

    @Autowired
    public void setUserRepository(UserRepository userRepository){
        this.userRepository=userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AppUser user = userRepository.findByUsername(username).orElseThrow(
                ()->new UsernameNotFoundException("user not found!")
        );
        Set<SimpleGrantedAuthority> GrantedAuthorities = new HashSet<>();
        GrantedAuthorities.add(new SimpleGrantedAuthority(user.getAuthority().getAuthority()));
        return new User(user.getUsername(),user.getPassword(),GrantedAuthorities);
    }
}
