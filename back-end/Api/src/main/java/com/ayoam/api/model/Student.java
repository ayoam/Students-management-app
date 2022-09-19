package com.ayoam.api.model;

import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity(name="student")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    private Date birthDate;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    @Pattern(regexp = "^06\\d{8}$",message = "phone number invalid!")
    private String phoneNumber;

    @OneToOne
    @JoinColumn(name="specId")
    private Speciality speciality;
}
