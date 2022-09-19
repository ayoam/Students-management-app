package com.ayoam.api.repository;

import com.ayoam.api.model.Authority;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AuthorityRepository extends JpaRepository<Authority,Long> {

    Optional<Authority> findByAuthority(String name);
}
