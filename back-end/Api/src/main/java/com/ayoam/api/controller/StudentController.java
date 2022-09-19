package com.ayoam.api.controller;

import com.ayoam.api.dto.StudentDto;
import com.ayoam.api.dto.UserDto;
import com.ayoam.api.dto.ValidateEmailRequest;
import com.ayoam.api.model.AppUser;
import com.ayoam.api.model.Student;
import com.ayoam.api.service.StudentSevice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
public class StudentController {
    private StudentSevice studentSevice;

    @Autowired
    public void setStudentSevice(StudentSevice studentSevice){
        this.studentSevice=studentSevice;
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @GetMapping("/students")
    public ResponseEntity<List<Student>> getStudents(@RequestParam Map<String,String> filters, HttpServletResponse response){
        return new ResponseEntity<List<Student>>(studentSevice.getStudents(filters,response), HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PostMapping("/students/validateEmail")
    public ResponseEntity<Boolean> getStudents(@RequestBody ValidateEmailRequest validateEmailRequest) throws Exception {
        return new ResponseEntity<Boolean>(studentSevice.validateEmail(validateEmailRequest.getEmail()), HttpStatus.OK);
    }

    @GetMapping("/test")
    public ResponseEntity<HttpStatus> test(){
        return new ResponseEntity<HttpStatus>(HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/students")
    public ResponseEntity<Student> addStudent(@RequestBody @Valid StudentDto studentDto){
        return new ResponseEntity<Student>(studentSevice.addStudent(studentDto), HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/students/{id}")
    public ResponseEntity<Student> updateStudent(@RequestBody @Valid StudentDto studentDto,@PathVariable Long id){
        return new ResponseEntity<Student>(studentSevice.updateStudent(studentDto,id), HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/students/{id}")
    public ResponseEntity<HttpStatus> updateStudent(@PathVariable Long id){
        studentSevice.deleteStudent(id);
        return new ResponseEntity<HttpStatus>(HttpStatus.OK);
    }

//    @PreAuthorize("hasAnyRole('USER','ADMIN')")
//    @GetMapping("/students/search")
//    public ResponseEntity<List<Student>> searchStudent(@RequestParam Map<String,String> filters,@RequestParam int pageNumber, @RequestParam int pageSize ,HttpServletResponse response){
//        return new ResponseEntity<List<Student>>(studentSevice.searchStudent(filters,pageNumber,pageSize,response), HttpStatus.OK);
//    }

}
