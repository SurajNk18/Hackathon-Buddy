package com.hackathonbuddy.config;

import com.hackathonbuddy.entity.Hackathon;
import com.hackathonbuddy.entity.Role;
import com.hackathonbuddy.entity.Skill;
import com.hackathonbuddy.repository.HackathonRepository;
import com.hackathonbuddy.repository.RoleRepository;
import com.hackathonbuddy.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final HackathonRepository hackathonRepository;
    private final SkillRepository skillRepository;

    @Override
    public void run(String... args) throws Exception {
        initRoles();
        initSkills();
        initHackathons();
    }

    private void initRoles() {
        if (roleRepository.count() == 0) {
            List<Role> roles = Arrays.asList(
                    Role.builder().name("STUDENT").build(),
                    Role.builder().name("DEVELOPER").build(),
                    Role.builder().name("ORGANIZER").build(),
                    Role.builder().name("COMPANY").build(),
                    Role.builder().name("ADMIN").build()
            );
            roleRepository.saveAll(roles);
            log.info("Initialized {} roles", roles.size());
        }
    }

    private void initSkills() {
        if (skillRepository.count() == 0) {
            List<Skill> skills = Arrays.asList(
                    Skill.builder().name("React").category("Frontend").build(),
                    Skill.builder().name("Vue.js").category("Frontend").build(),
                    Skill.builder().name("Angular").category("Frontend").build(),
                    Skill.builder().name("Spring Boot").category("Backend").build(),
                    Skill.builder().name("Node.js").category("Backend").build(),
                    Skill.builder().name("Django").category("Backend").build(),
                    Skill.builder().name("Python").category("ML").build(),
                    Skill.builder().name("TensorFlow").category("ML").build(),
                    Skill.builder().name("PyTorch").category("ML").build(),
                    Skill.builder().name("Docker").category("DevOps").build(),
                    Skill.builder().name("Kubernetes").category("DevOps").build(),
                    Skill.builder().name("AWS").category("DevOps").build(),
                    Skill.builder().name("Figma").category("Design").build(),
                    Skill.builder().name("MySQL").category("Database").build(),
                    Skill.builder().name("MongoDB").category("Database").build(),
                    Skill.builder().name("Java").category("Backend").build(),
                    Skill.builder().name("JavaScript").category("Frontend").build(),
                    Skill.builder().name("TypeScript").category("Frontend").build(),
                    Skill.builder().name("Solidity").category("Blockchain").build(),
                    Skill.builder().name("Flutter").category("Mobile").build()
            );
            skillRepository.saveAll(skills);
            log.info("Initialized {} skills", skills.size());
        }
    }

    private void initHackathons() {
        if (hackathonRepository.count() == 0) {
            List<Hackathon> hackathons = Arrays.asList(
                    Hackathon.builder()
                            .title("AI Innovation Challenge 2024")
                            .description("Build cutting-edge AI solutions to solve real-world problems.")
                            .category("AI/ML")
                            .organizer("Google Developers")
                            .startDate(LocalDate.of(2024, 8, 18))
                            .endDate(LocalDate.of(2024, 8, 20))
                            .registrationDeadline(LocalDate.of(2024, 8, 15))
                            .prizePool("Rs. 5,00,000")
                            .location("Online")
                            .mode("ONLINE")
                            .minTeamSize(2)
                            .maxTeamSize(4)
                            .isActive(true)
                            .build(),
                    Hackathon.builder()
                            .title("Smart City Hackathon")
                            .description("Design smart solutions for urban challenges.")
                            .category("Smart City")
                            .organizer("Municipal Corporation of India")
                            .startDate(LocalDate.of(2024, 8, 25))
                            .endDate(LocalDate.of(2024, 8, 27))
                            .registrationDeadline(LocalDate.of(2024, 8, 20))
                            .prizePool("Rs. 3,00,000")
                            .location("Mumbai")
                            .mode("OFFLINE")
                            .minTeamSize(2)
                            .maxTeamSize(5)
                            .isActive(true)
                            .build(),
                    Hackathon.builder()
                            .title("FinTech Challenge")
                            .description("Revolutionize financial services with innovative tech solutions.")
                            .category("FinTech")
                            .organizer("RazorPay & PayTM")
                            .startDate(LocalDate.of(2024, 9, 2))
                            .endDate(LocalDate.of(2024, 9, 4))
                            .registrationDeadline(LocalDate.of(2024, 8, 28))
                            .prizePool("Rs. 4,00,000")
                            .location("Bangalore")
                            .mode("HYBRID")
                            .minTeamSize(2)
                            .maxTeamSize(4)
                            .isActive(true)
                            .build(),
                    Hackathon.builder()
                            .title("Web3 Builders Hackathon")
                            .description("Build the future of decentralized web — DeFi, NFTs, and DAOs.")
                            .category("Blockchain")
                            .organizer("Ethereum Foundation")
                            .startDate(LocalDate.of(2024, 9, 15))
                            .endDate(LocalDate.of(2024, 9, 17))
                            .registrationDeadline(LocalDate.of(2024, 9, 10))
                            .prizePool("Rs. 6,00,000")
                            .location("Online")
                            .mode("ONLINE")
                            .minTeamSize(1)
                            .maxTeamSize(3)
                            .isActive(true)
                            .build(),
                    Hackathon.builder()
                            .title("HealthTech Innovation Sprint")
                            .description("Use technology to transform healthcare — telemedicine and diagnostics.")
                            .category("HealthTech")
                            .organizer("Apollo Hospitals")
                            .startDate(LocalDate.of(2024, 9, 22))
                            .endDate(LocalDate.of(2024, 9, 24))
                            .registrationDeadline(LocalDate.of(2024, 9, 18))
                            .prizePool("Rs. 2,50,000")
                            .location("Delhi")
                            .mode("OFFLINE")
                            .minTeamSize(2)
                            .maxTeamSize(5)
                            .isActive(true)
                            .build()
            );
            hackathonRepository.saveAll(hackathons);
            log.info("Initialized {} sample hackathons", hackathons.size());
        }
    }
}
