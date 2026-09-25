package com.hackathonbuddy.config;

import com.hackathonbuddy.entity.Hackathon;
import com.hackathonbuddy.entity.Role;
import com.hackathonbuddy.entity.Skill;
import com.hackathonbuddy.entity.User;
import com.hackathonbuddy.repository.HackathonRepository;
import com.hackathonbuddy.repository.RoleRepository;
import com.hackathonbuddy.repository.SkillRepository;
import com.hackathonbuddy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
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
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        initRoles();
        initSkills();
        initHackathons();
        initAdminUser();
        initSampleUsers();
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
                    Skill.builder().name("PostgreSQL").category("Database").build(),
                    Skill.builder().name("Java").category("Backend").build(),
                    Skill.builder().name("JavaScript").category("Frontend").build(),
                    Skill.builder().name("TypeScript").category("Frontend").build(),
                    Skill.builder().name("Solidity").category("Blockchain").build(),
                    Skill.builder().name("Flutter").category("Mobile").build(),
                    Skill.builder().name("FastAPI").category("Backend").build(),
                    Skill.builder().name("NLP").category("ML").build(),
                    Skill.builder().name("CI/CD").category("DevOps").build()
            );
            skillRepository.saveAll(skills);
            log.info("Initialized {} skills", skills.size());
        }
    }

    private void initHackathons() {
        if (hackathonRepository.count() == 0) {
            List<Hackathon> hackathons = Arrays.asList(
                    Hackathon.builder()
                            .title("AI Innovation Challenge 2026")
                            .description("Build innovative AI-powered solutions that solve real-world problems using machine learning and generative AI.")
                            .category("AI/ML")
                            .organizer("Google Developers")
                            .startDate(LocalDate.of(2026, 8, 18))
                            .endDate(LocalDate.of(2026, 8, 20))
                            .registrationDeadline(LocalDate.of(2026, 8, 15))
                            .prizePool("₹5,00,000")
                            .location("Online")
                            .mode("ONLINE")
                            .minTeamSize(2).maxTeamSize(4)
                            .duration("48 Hours").icon("🤖").color("purple").type("ai")
                            .level("Intermediate").status("Open").participantCount(1240)
                            .isActive(true).build(),
                    Hackathon.builder()
                            .title("Smart City Hackathon")
                            .description("Create technology solutions for smarter transportation, sustainable cities and better public services.")
                            .category("Smart City")
                            .organizer("Municipal Corporation of India")
                            .startDate(LocalDate.of(2026, 8, 25))
                            .endDate(LocalDate.of(2026, 8, 27))
                            .registrationDeadline(LocalDate.of(2026, 8, 22))
                            .prizePool("₹3,00,000")
                            .location("Mumbai")
                            .mode("OFFLINE")
                            .minTeamSize(2).maxTeamSize(5)
                            .duration("36 Hours").icon("🏙️").color("blue").type("city")
                            .level("Intermediate").status("Open").participantCount(860)
                            .isActive(true).build(),
                    Hackathon.builder()
                            .title("FinTech Challenge")
                            .description("Build the next generation of financial technology products with secure and scalable solutions.")
                            .category("FinTech")
                            .organizer("RazorPay & PayTM")
                            .startDate(LocalDate.of(2026, 9, 2))
                            .endDate(LocalDate.of(2026, 9, 4))
                            .registrationDeadline(LocalDate.of(2026, 8, 29))
                            .prizePool("₹4,00,000")
                            .location("Bangalore")
                            .mode("HYBRID")
                            .minTeamSize(2).maxTeamSize(4)
                            .duration("48 Hours").icon("💳").color("orange").type("fintech")
                            .level("Advanced").status("Open").participantCount(720)
                            .isActive(true).build(),
                    Hackathon.builder()
                            .title("Web3 Builders Arena")
                            .description("Build decentralized applications and explore the future of blockchain technology.")
                            .category("Web3")
                            .organizer("Ethereum Foundation")
                            .startDate(LocalDate.of(2026, 9, 10))
                            .endDate(LocalDate.of(2026, 9, 12))
                            .registrationDeadline(LocalDate.of(2026, 9, 6))
                            .prizePool("₹2,50,000")
                            .location("Online")
                            .mode("ONLINE")
                            .minTeamSize(1).maxTeamSize(3)
                            .duration("48 Hours").icon("⛓️").color("cyan").type("web3")
                            .level("Advanced").status("Open").participantCount(530)
                            .isActive(true).build(),
                    Hackathon.builder()
                            .title("GreenTech Innovation Hack")
                            .description("Develop technology-driven solutions for climate change, renewable energy and sustainability.")
                            .category("Environment")
                            .organizer("GreenTech Foundation")
                            .startDate(LocalDate.of(2026, 9, 18))
                            .endDate(LocalDate.of(2026, 9, 19))
                            .registrationDeadline(LocalDate.of(2026, 9, 14))
                            .prizePool("₹2,00,000")
                            .location("Pune")
                            .mode("OFFLINE")
                            .minTeamSize(2).maxTeamSize(5)
                            .duration("24 Hours").icon("🌱").color("green").type("green")
                            .level("Beginner").status("Open").participantCount(430)
                            .isActive(true).build(),
                    Hackathon.builder()
                            .title("Healthcare AI Sprint")
                            .description("Use AI and software technology to create better healthcare experiences and intelligent solutions.")
                            .category("Healthcare")
                            .organizer("Apollo Hospitals")
                            .startDate(LocalDate.of(2026, 9, 25))
                            .endDate(LocalDate.of(2026, 9, 27))
                            .registrationDeadline(LocalDate.of(2026, 9, 21))
                            .prizePool("₹3,50,000")
                            .location("Online")
                            .mode("ONLINE")
                            .minTeamSize(2).maxTeamSize(4)
                            .duration("48 Hours").icon("🏥").color("pink").type("health")
                            .level("Intermediate").status("Open").participantCount(650)
                            .isActive(true).build()
            );
            hackathonRepository.saveAll(hackathons);
            log.info("Initialized {} sample hackathons", hackathons.size());
        }
    }

    private void initAdminUser() {
        if (!userRepository.existsByEmail("admin@hackathonbuddy.com")) {
            Role adminRole = roleRepository.findByName("ADMIN")
                    .orElseThrow(() -> new RuntimeException("ADMIN role not found"));

            User admin = User.builder()
                    .firstName("System")
                    .lastName("Administrator")
                    .email("admin@hackathonbuddy.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(adminRole)
                    .primaryRole("Platform Administrator")
                    .location("HQ Command Center")
                    .bio("Platform Administrator with full permissions over hackathon challenges, user moderation, and AI telemetry.")
                    .isActive(true)
                    .profileComplete(true)
                    .build();
            userRepository.save(admin);
            log.info("Admin user created: admin@hackathonbuddy.com / admin123");
        }
    }

    private void initSampleUsers() {
        Role studentRole = roleRepository.findByName("STUDENT")
                .orElseThrow(() -> new RuntimeException("STUDENT role not found"));

        if (!userRepository.existsByEmail("sanika@example.com")) {
            User sanika = User.builder()
                    .firstName("Sanika").lastName("Haridas Pandhare")
                    .email("sanika@example.com")
                    .password(passwordEncoder.encode("password123"))
                    .role(studentRole)
                    .primaryRole("Full Stack Developer")
                    .location("Pune, India")
                    .bio("Full Stack Developer passionate about building high-impact web apps, AI integrations, and winning hackathons.")
                    .githubUrl("https://github.com/sanikapandhare")
                    .linkedinUrl("https://linkedin.com/in/sanikapandhare")
                    .isActive(true).profileComplete(true)
                    .build();
            userRepository.save(sanika);
            log.info("Sample user created: sanika@example.com / password123");
        }

        if (!userRepository.existsByEmail("priya@example.com")) {
            userRepository.save(User.builder()
                    .firstName("Priya").lastName("Sharma")
                    .email("priya@example.com")
                    .password(passwordEncoder.encode("password123"))
                    .role(studentRole)
                    .primaryRole("UI/UX Designer")
                    .location("Mumbai, India")
                    .isActive(true).profileComplete(true)
                    .build());
        }

        if (!userRepository.existsByEmail("rohan@example.com")) {
            userRepository.save(User.builder()
                    .firstName("Rohan").lastName("Mehta")
                    .email("rohan@example.com")
                    .password(passwordEncoder.encode("password123"))
                    .role(studentRole)
                    .primaryRole("ML Engineer")
                    .location("Delhi, India")
                    .isActive(true).profileComplete(true)
                    .build());
        }

        if (!userRepository.existsByEmail("aman@example.com")) {
            userRepository.save(User.builder()
                    .firstName("Aman").lastName("Khan")
                    .email("aman@example.com")
                    .password(passwordEncoder.encode("password123"))
                    .role(studentRole)
                    .primaryRole("DevOps Engineer")
                    .location("Bangalore, India")
                    .isActive(true).profileComplete(true)
                    .build());
        }
    }
}
