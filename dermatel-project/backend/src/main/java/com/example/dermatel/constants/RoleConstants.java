package com.example.dermatel.constants;

import java.util.Arrays;
import java.util.List;

public final class RoleConstants {
    private RoleConstants() {
        // private constructor to prevent instantiation
    }

    public static final String ROLE_PATIENT = "ROLE_PATIENT";
    public static final String ROLE_ADMIN = "ROLE_ADMIN";
    public static final String ROLE_DERMATOLOGIST = "ROLE_DERMATOLOGIST";
    public static final List<String> VALID_ROLES = Arrays.asList(ROLE_ADMIN, ROLE_PATIENT, ROLE_DERMATOLOGIST);
}
