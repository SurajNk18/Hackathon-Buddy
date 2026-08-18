package com.hackathonbuddy.repository;

import com.hackathonbuddy.entity.Skill;
import com.hackathonbuddy.entity.UserSkill;
import com.hackathonbuddy.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserSkillRepository extends JpaRepository<UserSkill, Long> {
    List<UserSkill> findByUser(User user);
    Optional<UserSkill> findByUserAndSkill(User user, Skill skill);
    void deleteByUserAndSkillId(User user, Long skillId);
}
