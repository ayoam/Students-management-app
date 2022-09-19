package com.ayoam.api.query;

import com.ayoam.api.model.QStudent;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;

import java.util.Map;

public class StudentPredicateBuilder {
   public static Predicate studentFilters(Map<String,String> filters){
       QStudent student = QStudent.student;
       BooleanBuilder where = new BooleanBuilder();
       if (filters.get("name") != null) {
           if(!filters.get("name").isEmpty()){
               where.and(student.name.contains(filters.get("name")));
           }
       }
       return where;
    }
}
