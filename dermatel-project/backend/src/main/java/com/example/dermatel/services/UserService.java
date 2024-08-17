package com.example.dermatel.services;

import com.example.dermatel.constants.RoleConstants;
import com.example.dermatel.entities.User;
import com.example.dermatel.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    public boolean isAdminAlreadyExists() {
        return userRepository.countByRole(RoleConstants.ROLE_ADMIN) > 0;
    }
}
