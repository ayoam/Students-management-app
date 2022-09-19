package com.ayoam.api.controller;

import com.ayoam.api.model.Speciality;
import com.ayoam.api.model.Student;
import com.ayoam.api.service.SpecialityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class SpecialityController {
    private SpecialityService specialityService;

    @Autowired
    public void setSpecialityService(SpecialityService specialityService) {
        this.specialityService = specialityService;
    }

    @GetMapping("/speciality")
    public ResponseEntity<List<Speciality>> getSpecialities(){
        return new ResponseEntity<List<Speciality>>(specialityService.getSpecialities(), HttpStatus.OK);
    }
}
