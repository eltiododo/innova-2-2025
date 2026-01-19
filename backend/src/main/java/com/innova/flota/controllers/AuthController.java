package com.innova.flota.controllers;

import com.innova.flota.entities.Users;
import com.innova.flota.services.AuthService;
import graphql.GraphQLContext;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;

@Controller
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    public record RegisterInput(String username, String email, String password, String phone, String role) {
    }

    public record LoginInput(String email, String password) {
    }

    public record AuthPayload(String token, Users user) {
    }

    @MutationMapping
    public AuthPayload register(@Argument RegisterInput input) {
        Users.Roles role;
        try {
            role = Users.Roles.valueOf(input.role());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid role: " + input.role());
        }

        AuthService.RegisterInput serviceInput = new AuthService.RegisterInput(
                input.username(),
                input.email(),
                input.password(),
                input.phone(),
                role);

        AuthService.AuthPayload result = authService.register(serviceInput);
        return new AuthPayload(result.token(), result.user());
    }

    @MutationMapping
    public AuthPayload login(@Argument LoginInput input) {
        AuthService.LoginInput serviceInput = new AuthService.LoginInput(
                input.email(),
                input.password());

        AuthService.AuthPayload result = authService.login(serviceInput);
        return new AuthPayload(result.token(), result.user());
    }

    @QueryMapping
    public Users me(GraphQLContext context) {
        String token = extractTokenFromRequest();
        if (token == null) {
            return null;
        }
        return authService.getUserFromToken(token);
    }

    private String extractTokenFromRequest() {
        RequestAttributes requestAttributes = RequestContextHolder.getRequestAttributes();
        if (requestAttributes instanceof ServletRequestAttributes servletRequestAttributes) {
            HttpServletRequest request = servletRequestAttributes.getRequest();
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                return authHeader.substring(7);
            }
        }
        return null;
    }
}
