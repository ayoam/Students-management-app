package com.ayoam.api.converter;

import com.ayoam.api.dto.*;
import com.ayoam.api.model.AppUser;
import com.ayoam.api.model.Speciality;
import com.ayoam.api.model.Student;
import com.ayoam.api.repository.SpecialityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class UserConverter {

    public UserDto entityToDto(AppUser user){
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setPassword(user.getPassword());
        return dto;
    }

    public AppUser dtoToEntity(UserDto dto){
        AppUser user = new AppUser();
        user.setId(dto.getId());
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        return user;
    }
}
