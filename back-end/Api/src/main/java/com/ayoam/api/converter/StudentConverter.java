package com.ayoam.api.converter;

import com.ayoam.api.dto.StudentDto;
import com.ayoam.api.model.Speciality;
import com.ayoam.api.model.Student;
import com.ayoam.api.repository.SpecialityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class StudentConverter {

    public StudentDto entityToDto(Student student){
        StudentDto dto = new StudentDto();
        dto.setId(student.getId());
        dto.setName(student.getName());
        dto.setEmail(student.getEmail());
        dto.setPhoneNumber(student.getPhoneNumber());
        dto.setBirthDate(student.getBirthDate());
        dto.setSpecId(student.getSpeciality().getId());

        return dto;
    }

    public Student dtoToEntity(StudentDto dto){
        Student student = new Student();
        student.setId(dto.getId());
        student.setName(dto.getName());
        student.setEmail(dto.getEmail());
        student.setPhoneNumber(dto.getPhoneNumber());
        student.setBirthDate(dto.getBirthDate());
        return student;
    }
}
