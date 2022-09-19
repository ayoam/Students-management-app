package com.ayoam.api.service;

import com.ayoam.api.model.Speciality;
import com.ayoam.api.repository.SpecialityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SpecialityService {
    private SpecialityRepository specialityRepository;

    @Autowired
    public void setSpecialityRepository(SpecialityRepository specialityRepository) {
        this.specialityRepository = specialityRepository;
    }

    public List<Speciality> getSpecialities(){
        return specialityRepository.findAll();
    }
}
