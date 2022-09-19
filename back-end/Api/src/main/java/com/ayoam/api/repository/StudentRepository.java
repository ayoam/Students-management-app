package com.ayoam.api.repository;

import com.ayoam.api.model.Student;
import com.querydsl.core.types.Predicate;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRepository extends PagingAndSortingRepository<Student,Long>, QuerydslPredicateExecutor<Student> {
    public List<Student> findByNameIgnoreCase(String name);
    public Long countByEmailIgnoreCase(String email);
}
