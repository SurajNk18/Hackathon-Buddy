package com.hackathonbuddy.config;

import com.hackathonbuddy.security.CustomAccessDeniedHandler;
import com.hackathonbuddy.security.CustomUserDetailsService;
import com.hackathonbuddy.security.JwtAuthenticationEntryPoint;
import com.hackathonbuddy.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Spring Security configuration with proper RBAC.
 *
 * Role hierarchy:
 *   SUPER_ADMIN  → full platform access (all admin + student endpoints)
 *   HACKATHON_ADMIN → hackathon management endpoints
 *   DEVELOPER_ADMIN → developer management endpoints
 *   ADMIN → legacy admin endpoints
 *   STUDENT → standard user endpoints
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final CustomUserDetailsService userDetailsService;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final CustomAccessDeniedHandler customAccessDeniedHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(org.springframework.security.config.Customizer.withDefaults())
            .csrf(AbstractHttpConfigurer::disable)
            .exceptionHandling(exception -> exception
                .authenticationEntryPoint(jwtAuthenticationEntryPoint)  // 401
                .accessDeniedHandler(customAccessDeniedHandler)         // 403
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth
                // ─── PUBLIC ENDPOINTS ───────────────────────────────
                .requestMatchers("/api/auth/register", "/api/auth/login").permitAll()
                .requestMatchers("/api/health").permitAll()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .requestMatchers("/api/skills/catalog").permitAll()
                .requestMatchers("/ws/**").permitAll()

                // ─── SUPER ADMIN ONLY ──────────────────────────────
                // Only SUPER_ADMIN can manage the whole platform, create admins, manage all users
                .requestMatchers("/api/super-admin/**")
                    .hasRole("SUPER_ADMIN")

                // ─── HACKATHON ADMIN ───────────────────────────────
                // HACKATHON_ADMIN + SUPER_ADMIN can manage hackathons
                .requestMatchers("/api/hackathon-admin/**")
                    .hasAnyRole("HACKATHON_ADMIN", "SUPER_ADMIN")

                // ─── DEVELOPER ADMIN ───────────────────────────────
                // DEVELOPER_ADMIN + SUPER_ADMIN can manage developers
                .requestMatchers("/api/developer-admin/**")
                    .hasAnyRole("DEVELOPER_ADMIN", "SUPER_ADMIN")

                // ─── GENERAL ADMIN ─────────────────────────────────
                // Any admin role can access the legacy admin console
                .requestMatchers("/api/admin/**")
                    .hasAnyRole("ADMIN", "HACKATHON_ADMIN", "DEVELOPER_ADMIN", "SUPER_ADMIN")

                // ─── STUDENT / PARTICIPANT ONLY ENDPOINTS ──────────
                // Admins and Super Admins cannot access these student features
                .requestMatchers("/api/dashboard/**", "/api/teams/**", "/api/ai/**", "/api/projects/**", "/api/chat/**", "/api/registrations/**")
                    .hasAnyRole("STUDENT", "DEVELOPER", "ORGANIZER", "COMPANY")

                // ─── AUTHENTICATED USER ENDPOINTS (ALL ROLES) ──────
                .requestMatchers("/api/profile/**").authenticated()
                .requestMatchers("/api/hackathons/**").authenticated() // Viewing hackathons is allowed for all
                .requestMatchers("/api/activity/**").authenticated()
                .requestMatchers("/api/notifications/**").authenticated()
                .requestMatchers("/api/users/**").authenticated()
                .requestMatchers("/api/skills/**").authenticated()

                // ─── CATCH ALL ─────────────────────────────────────
                .anyRequest().authenticated()
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @org.springframework.beans.factory.annotation.Value("${cors.allowed-origins:http://localhost:5173,http://localhost:5174}")
    private String allowedOrigins;

    @Bean
    public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {
        org.springframework.web.cors.CorsConfiguration configuration = new org.springframework.web.cors.CorsConfiguration();
        configuration.setAllowedOrigins(java.util.Arrays.asList(allowedOrigins.split(",")));
        configuration.setAllowedMethods(java.util.Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(java.util.List.of("*"));
        configuration.setExposedHeaders(java.util.List.of("Authorization"));
        configuration.setAllowCredentials(true);
        org.springframework.web.cors.UrlBasedCorsConfigurationSource source = new org.springframework.web.cors.UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
