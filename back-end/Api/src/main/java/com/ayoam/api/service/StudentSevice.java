package com.ayoam.api.service;

import com.ayoam.api.converter.StudentConverter;
import com.ayoam.api.dto.StudentDto;
import com.ayoam.api.model.Speciality;
import com.ayoam.api.model.Student;
import com.ayoam.api.query.StudentPredicateBuilder;
import com.ayoam.api.repository.SpecialityRepository;
import com.ayoam.api.repository.StudentRepository;
import com.google.common.collect.Iterators;
import com.querydsl.core.types.Predicate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.StreamSupport;

@Service
public class StudentSevice {
    private StudentRepository studentRepository;
    private StudentConverter studentConverter;
    private SpecialityRepository specialityRepository;


    public StudentSevice(StudentRepository studentRepository, StudentConverter studentConverter, SpecialityRepository specialityRepository) {
        this.studentRepository = studentRepository;
        this.studentConverter = studentConverter;
        this.specialityRepository = specialityRepository;
    }

/*
    @Autowired
    public void setSpecialityRepository(SpecialityRepository specialityRepository){
        this.specialityRepository=specialityRepository;
    }


    @Autowired
    public void setStudentRepository(StudentRepository studentRepository){
        this.studentRepository=studentRepository;
    }

    @Autowired
    public void setStudentConverter(StudentConverter studentConverter){
        this.studentConverter=studentConverter;
    }*/

    public List<Student> getStudents(Map<String,String> filters, HttpServletResponse response){
        Pageable pages = PageRequest.of(Integer.parseInt(filters.get("page")),Integer.parseInt(filters.get("limit")), Sort.by(Sort.Direction.ASC, "id"));
        Predicate predicate = StudentPredicateBuilder.studentFilters(filters);
//        var iterator = studentRepository.findAllByOrderByIdAsc(predicate,pages);
        var iterator = studentRepository.findAll(predicate,pages);
        var studentsList = new ArrayList<Student>();

        int count;
//        if(filters.get("name")==null){
//            count=studentRepository.count();
//        }else if (filters.get("name").isEmpty()){
//            count=studentRepository.count();
//        }
//        else{
//            count= Iterators.size(iterator);
//        }


        iterator.forEach(student -> {
            Student s = new Student();
            s.setName(student.getName());
            s.setEmail(student.getEmail());
            s.setPhoneNumber(student.getPhoneNumber());
            s.setBirthDate(student.getBirthDate());
            s.setId(student.getId());
            s.setSpeciality(student.getSpeciality());
            studentsList.add(s);
            System.out.println(s.getId());
        });

        count= Iterators.size(studentRepository.findAll(predicate).iterator());
        response.addHeader("X-total-count", count+"");

        return  studentsList;
    }

    public Student addStudent(StudentDto studentDto){
        Speciality spec = specialityRepository.findById(studentDto.getSpecId()).orElse(null);
        if(spec==null){
            throw new RuntimeException("speciality not found!");
        }
        Student student = studentConverter.dtoToEntity(studentDto);
        student.setSpeciality(spec);
        return studentRepository.save(student);
    }

    public Student updateStudent(StudentDto studentDto,Long id){
        Speciality spec = specialityRepository.findById(studentDto.getSpecId()).orElse(null);
        if(spec==null){
            throw new RuntimeException("speciality not found!");
        }

        Student stu = studentRepository.findById(id).orElse(null);
        if(stu==null){
            throw new RuntimeException("Student not found!");
        }

        studentDto.setId(id);
        Student student = studentConverter.dtoToEntity(studentDto);
        student.setSpeciality(spec);
        return studentRepository.save(student);
    }

    public void deleteStudent(Long id){
        Student stu = studentRepository.findById(id).orElse(null);
        if(stu==null){
            throw new RuntimeException("Student not found!");
        }
        studentRepository.delete(stu);
    }

    public boolean validateEmail(String email) throws Exception {
        Long count = studentRepository.countByEmailIgnoreCase(email);
        if(count>0){
            throw new Exception("email already exists");
        }
        else{
            return true;
        }
    }

//    public List<Student> searchStudent(Map<String,String> filters, int pageNumber, int pageSize, HttpServletResponse response){
//        Pageable pages = PageRequest.of(pageNumber,pageSize);
//        Predicate predicate = StudentPredicateBuilder.studentFilters(filters);
//        var iterator = studentRepository.findAll(predicate,pages);
//        int count= 0;
//        var studentsList = new ArrayList<Student>();
//
//        for (Object i : iterator) {
//            count++;
//        }
//
//        response.addHeader("X-total-count", count+"");
//
//        iterator.forEach(student -> {
//            Student s = new Student();
//            s.setName(student.getName());
//            s.setEmail(student.getEmail());
//            s.setPhoneNumber(student.getPhoneNumber());
//            s.setBirthDate(student.getBirthDate());
//            s.setId(student.getId());
//            s.setSpeciality(student.getSpeciality());
//            studentsList.add(s);
//        });
//
//        return  studentsList;
//    }
}
