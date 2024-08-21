package com.example.dermatel.utils;

import java.util.Set;

public class RoleValidator {
    private static final Set<String> VALID_ROLES = Set.of("ADMIN", "DERMATOLOGIST", "PATIENT");

    public static boolean isValidRole(String role) {
        return VALID_ROLES.contains(role);
    }
}
