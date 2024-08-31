package com.example.dermatel.services;

import com.example.dermatel.constants.RoleConstants;
import com.example.dermatel.entities.User;
import com.example.dermatel.repositories.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public boolean isAdminAlreadyExists() {
        boolean exists = userRepository.countByRole(RoleConstants.ROLE_ADMIN) > 0;
        logger.info("Admin existence check: {}", exists);
        return exists;
    }
}