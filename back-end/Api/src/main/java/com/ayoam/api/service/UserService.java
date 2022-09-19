package com.ayoam.api.service;

import com.ayoam.api.converter.UserConverter;
import com.ayoam.api.dto.AddRoleUserDto;
import com.ayoam.api.dto.UserDto;
import com.ayoam.api.dto.UserLoginDto;
import com.ayoam.api.exception.ResourceNotFoundException;
import com.ayoam.api.model.AppUser;
import com.ayoam.api.model.AuthResponse;
import com.ayoam.api.model.Authority;
import com.ayoam.api.repository.AuthorityRepository;
import com.ayoam.api.repository.UserRepository;
import com.ayoam.api.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.*;

@Service
public class UserService {
    private UserRepository userRepository;
    private UserConverter userConverter;
    private PasswordEncoder passwordEncoder;
    private AuthenticationManager authenticationManager;
    private CustomUserDetailsService userDetailsService;
    private JwtUtil jwtUtil;

    private AuthorityRepository authorityRepository;

    @Autowired
    public void setAuthorityRepository(AuthorityRepository authorityRepository) {
        this.authorityRepository = authorityRepository;
    }

    @Autowired
    public void setJwtUtil(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Autowired
    public void setUserDetailsService(CustomUserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Autowired
    public void setAuthenticationManager(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    @Autowired
    public void setPasswordEncoder(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @Autowired
    public void setUserRepository(UserRepository userRepository){
        this.userRepository=userRepository;
    }

    @Autowired
    public void setUserConverter(UserConverter userConverter){
        this.userConverter=userConverter;
    }

    public AppUser registerUser(UserDto userDto){
        String encodedPassword = passwordEncoder.encode(userDto.getPassword());
        userDto.setPassword(encodedPassword);

        if(userRepository.findByUsernameIgnoreCase(userDto.getUsername()).orElse(null)!=null){
            throw new RuntimeException("Username already used!");
        }

        if(userRepository.findByEmailIgnoreCase(userDto.getEmail()).orElse(null)!=null){
            throw new RuntimeException("Email already used!");
        }

        AppUser user = userConverter.dtoToEntity(userDto);

        Authority Au = authorityRepository.findByAuthority("ROLE_USER").orElse(null);
        user.setAuthority(Au);
        return userRepository.save(user);
    }

    public AuthResponse generateToken(UserLoginDto userLoginDto, HttpServletResponse response) throws Exception {
        Authentication authentication;
        try{
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(userLoginDto.getUsername(),userLoginDto.getPassword())
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        catch(BadCredentialsException e){
            throw new Exception("Invalid Credentials!");
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(userLoginDto.getUsername());
        AppUser user = userRepository.findByUsername(userLoginDto.getUsername()).orElse(null);
        final Map<String,String> JwtTokens =jwtUtil.generateToken(userDetails);

        //send HttpOnly cookie
        Cookie refreshTokenCookie = new Cookie("refresh_token",JwtTokens.get("refresh_token"));
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setPath("/");
        response.addCookie(refreshTokenCookie);
        return new AuthResponse(JwtTokens.get("access_token"),user);
    }

    public AuthResponse refreshToken(HttpServletRequest request,HttpServletResponse response){
        String refresh_token = Arrays.stream(request.getCookies())
                .filter(cookie-> Objects.equals(cookie.getName(), "refresh_token"))
                .map(Cookie::getValue)
                .findAny().orElse(null);

        String username = null;

        username = jwtUtil.extractUsername(refresh_token);

        if (username != null && refresh_token!=null) {

            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

            if (jwtUtil.validateToken(refresh_token, userDetails,request)) {
                final Map<String, String> JwtTokens = jwtUtil.generateToken(userDetails);
                AppUser user = userRepository.findByUsername(username).orElse(null);
                return new AuthResponse(JwtTokens.get("access_token"),user);
            }
            else {
                removeRefreshTokenCookie(response);
                throw new RuntimeException("refresh token not valid!");
            }
        }
        else {
            removeRefreshTokenCookie(response);
            throw new RuntimeException("refresh token not valid!");
        }


    }

    public void removeRefreshTokenCookie(HttpServletResponse response){
        //remove HttpOnly cookie
        Cookie refreshTokenCookie = new Cookie("refresh_token",null);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(0);
        response.addCookie(refreshTokenCookie);
    }

    public void deleteUser(Long id){
        AppUser user = userRepository.findById(id).orElse(null);
        if(user==null){
            throw new RuntimeException("User not found!");
        }

        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UserDetails currentUser= ((UserDetails) principal);
        if(!Objects.equals(currentUser.getUsername(), user.getUsername()) && !Objects.equals(currentUser.getAuthorities().iterator().next().getAuthority(), "ROLE_ADMIN")){
            throw new RuntimeException("Access denied!");
        }

        userRepository.deleteById(id);
    };

    public AppUser updateUser(UserDto userDto){
        String encodedPassword = passwordEncoder.encode(userDto.getPassword());
        userDto.setPassword(encodedPassword);

        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UserDetails currentUser= ((UserDetails) principal);

        if(!Objects.equals(currentUser.getUsername(), userDto.getUsername()) && !Objects.equals(currentUser.getAuthorities().iterator().next().getAuthority(), "ROLE_ADMIN")){
            throw new RuntimeException("Access denied!");
        }

        if(userRepository.findById(userDto.getId()).orElse(null)==null){
            throw new RuntimeException("User not found!");
        }

        if(userRepository.findByUsernameIgnoreCase(userDto.getUsername()).orElse(null)!=null){
            if(!Objects.equals(userRepository.findByUsernameIgnoreCase(userDto.getUsername()).get().getUsername(), userDto.getUsername())){
                throw new RuntimeException("Username already used!");
            }
        }

        if(userRepository.findByEmailIgnoreCase(userDto.getEmail()).orElse(null)!=null){
            if(!Objects.equals(userRepository.findByEmailIgnoreCase(userDto.getEmail()).get().getEmail(), userDto.getEmail())){
                throw new RuntimeException("Email already used!");
            }
        }
        Authority Au = authorityRepository.findByAuthority("ROLE_USER").orElse(null);
        AppUser user = userConverter.dtoToEntity(userDto);
        user.setAuthority(Au);
        return userRepository.save(user);
    }

    public AppUser addRoleToUser(AddRoleUserDto addRoleUserDto){
        AppUser user = userRepository.findByUsername(addRoleUserDto.getUsername()).orElse(null);
        if(user==null){
            throw new ResourceNotFoundException("User not found!");
        }
        Authority Au = authorityRepository.findByAuthority(addRoleUserDto.getAuthority()).orElse(null);
        if(Au==null){
            throw new RuntimeException("Authority not valid!");
        }
        user.setAuthority(Au);
        return userRepository.save(user);
    }

    public void logout(HttpServletResponse response){
        removeRefreshTokenCookie(response);
    }
}
