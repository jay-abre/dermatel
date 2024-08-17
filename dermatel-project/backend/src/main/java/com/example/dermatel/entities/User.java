package com.example.dermatel.entities;

import com.example.dermatel.constants.RoleConstants;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String username;

    @Email
    private String email;

    @NotBlank
    private String password;

    @NotBlank
    private String role;

    public boolean isAdmin() {
        return RoleConstants.ROLE_ADMIN.equals(this.role);
    }

    public boolean isPatient() {
        return RoleConstants.ROLE_PATIENT.equals(this.role);
    }

    public boolean isDermatologist() {
        return RoleConstants.ROLE_DERMATOLOGIST.equals(this.role);
    }

}
