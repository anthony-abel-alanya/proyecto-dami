package com.proyecto.daw.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;

import com.proyecto.daw.security.JwtFilter;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

	private final JwtFilter jwtFilter;

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
		return config.getAuthenticationManager();
	}

	@Bean
	public WebSecurityCustomizer webSecurityCustomizer() {
		return (web) -> web.ignoring()
				.requestMatchers(new AntPathRequestMatcher("/uploads/**"));
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http
				.csrf(csrf -> csrf.disable())
				.cors(Customizer.withDefaults())
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authorizeHttpRequests(auth -> auth
						.requestMatchers(ant("/uploads/**"), ant("/static/**")).permitAll()
						.requestMatchers(ant(HttpMethod.POST, "/api/auth/login"), ant(HttpMethod.POST, "/api/auth/registro")).permitAll()
						.requestMatchers(ant(HttpMethod.GET, "/api/mascotas"), ant(HttpMethod.GET, "/api/mascotas/**"),
								ant(HttpMethod.GET, "/api/categorias")).permitAll()

						.requestMatchers(ant(HttpMethod.DELETE, "/api/mascotas/**"),
								ant(HttpMethod.DELETE, "/api/categorias/**")).hasRole("ADMIN")
						.requestMatchers(ant(HttpMethod.POST, "/api/usuarios/trabajador")).hasRole("ADMIN")
						.requestMatchers(ant(HttpMethod.PUT, "/api/usuarios/*/estado")).hasRole("ADMIN")
						.requestMatchers(ant(HttpMethod.GET, "/api/usuarios")).hasRole("ADMIN")

						.requestMatchers(ant(HttpMethod.POST, "/api/mascotas"))
								.hasAnyRole("ADMIN", "TRABAJADOR")
						.requestMatchers(ant(HttpMethod.PUT, "/api/mascotas/**"))
								.hasAnyRole("ADMIN", "TRABAJADOR")
						.requestMatchers(ant(HttpMethod.GET, "/api/solicitudes"))
								.hasAnyRole("ADMIN", "TRABAJADOR", "ADOPTANTE")
						.requestMatchers(ant(HttpMethod.GET, "/api/solicitudes/*/acta"),
								ant(HttpMethod.GET, "/api/usuarios/adoptantes"),
								ant(HttpMethod.GET, "/api/dashboard/**"))
								.hasAnyRole("ADMIN", "TRABAJADOR")
						.requestMatchers(ant(HttpMethod.PUT, "/api/solicitudes/*/estado"),
								ant(HttpMethod.PUT, "/api/solicitudes/*/verificar-acta"))
								.hasAnyRole("ADMIN", "TRABAJADOR")
						.requestMatchers(ant(HttpMethod.POST, "/api/solicitudes/*/estado"))
								.hasAnyRole("ADMIN", "TRABAJADOR")

						.requestMatchers(ant(HttpMethod.POST, "/api/solicitudes")).hasRole("ADOPTANTE")
						.requestMatchers(ant(HttpMethod.POST, "/api/solicitudes/*/acta-firmada")).hasRole("ADOPTANTE")

						.requestMatchers(ant(HttpMethod.GET, "/api/usuarios/perfil")).authenticated()
						.requestMatchers(ant(HttpMethod.PUT, "/api/usuarios/perfil")).authenticated()
						.requestMatchers(ant(HttpMethod.POST, "/api/auth/logout")).authenticated()
						.anyRequest().authenticated())
				.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}

	private RequestMatcher ant(String pattern) {
		return new AntPathRequestMatcher(pattern);
	}

	private RequestMatcher ant(HttpMethod method, String pattern) {
		return new AntPathRequestMatcher(pattern, method.name());
	}
}
