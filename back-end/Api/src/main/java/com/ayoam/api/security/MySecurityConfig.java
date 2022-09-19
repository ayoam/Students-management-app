package com.ayoam.api.security;


import com.ayoam.api.exception.CustomAccessDeniedHandler;
import com.ayoam.api.exception.CustomAuthenticationFailureHandler;
import com.ayoam.api.exception.CustomJWTAuthenticationEntryPoint;
import com.ayoam.api.service.CustomUserDetailsService;
import com.ayoam.api.filter.JwtRequestFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class MySecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }


    private CustomUserDetailsService customUserDetailsService;
    private JwtRequestFilter jwtRequestFilter;
    private CustomAccessDeniedHandler customAccessDeniedHandler;

    private CustomJWTAuthenticationEntryPoint customJWTAuthenticationEntryPoint;

    public MySecurityConfig(CustomUserDetailsService customUserDetailsService, JwtRequestFilter jwtRequestFilter, CustomAccessDeniedHandler customAccessDeniedHandler,CustomJWTAuthenticationEntryPoint customJWTAuthenticationEntryPoint) {
        this.customUserDetailsService = customUserDetailsService;
        this.jwtRequestFilter = jwtRequestFilter;
        this.customAccessDeniedHandler = customAccessDeniedHandler;
        this.customJWTAuthenticationEntryPoint= customJWTAuthenticationEntryPoint;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
   /*     // Configure AuthenticationManagerBuilder
        AuthenticationManagerBuilder authenticationManagerBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);
        authenticationManagerBuilder.userDetailsService(customUserDetailsService);
        // Get AuthenticationManager
        AuthenticationManager authenticationManager = authenticationManagerBuilder.build();
*/
            http
                .cors().and().csrf().disable()
                .authorizeRequests()
            /*    .antMatchers(HttpMethod.GET,"/students")
                .permitAll()
                .antMatchers("/students/**")
                .authenticated()*/
                .antMatchers("/auth/**")
                .permitAll()
//                    .and()
//                .antMatchers("/admin","/admin/**").hasRole("ADMIN")
                .anyRequest()
                .authenticated()
                .and()
                .authenticationManager(authenticationManager(http,customUserDetailsService,passwordEncoder()))
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .exceptionHandling()
                .accessDeniedHandler(customAccessDeniedHandler)
                .authenticationEntryPoint(customJWTAuthenticationEntryPoint)
                .and()
                .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class)
                .logout()
                .invalidateHttpSession(true)
                .deleteCookies("refresh_token");

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http,UserDetailsService udService,PasswordEncoder pwdEncoder) throws Exception{
        AuthenticationManagerBuilder authenticationManagerBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);
        authenticationManagerBuilder.userDetailsService(udService).passwordEncoder(pwdEncoder);
        return authenticationManagerBuilder.build();
    }

    @Bean
    public AuthenticationFailureHandler authenticationFailureHandler() {
        return new CustomAuthenticationFailureHandler();
    }


 /*   @Bean
    public InMemoryUserDetailsManager configureAuthentication(){
        List<UserDetails> userDetailsList = new ArrayList<>();
        List<GrantedAuthority> userRoles = new ArrayList<>();

        UserDetails user = User.builder()
                .passwordEncoder(passwordEncoder()::encode)
                .username("user")
                .password("password")
                .authorities(userRoles)
                .build();
        return new InMemoryUserDetailsManager(user);
    }
*/

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOriginPattern("*");
        config.addAllowedHeader("*");
        config.addAllowedMethod("OPTIONS");
        config.addAllowedMethod("HEAD");
        config.addAllowedMethod("GET");
        config.addAllowedMethod("PUT");
        config.addAllowedMethod("POST");
        config.addAllowedMethod("DELETE");
        config.addAllowedMethod("PATCH");
        config.addExposedHeader("X-Total-Count");
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
