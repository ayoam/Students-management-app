package com.ayoam.api.dto;

import com.ayoam.api.model.Speciality;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Component;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Date;

@Data
public class StudentDto {
    private Long id;
    @NotNull
    private String name;
    @NotNull
    private Date birthDate;
    @NotNull
    private String email;
    @NotNull
    private String phoneNumber;
    @NotNull
    private Long specId;
}
