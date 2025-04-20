package com.example.demo.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import com.example.demo.Entity.User;
import com.example.demo.Service.UserService;

@Controller
public class HomeController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private UserService userService;

    @GetMapping("/")
    @ResponseBody
    public String home() {
        return "Welcome to SingScapes!";
    }

    @GetMapping("/about")
    @ResponseBody
    public String about() {
        return "About SingScapes - Your Singapore Travel Companion";
    }

    @GetMapping("/contact")
    @ResponseBody
    public String contact() {
        return "Contact us at support@singscapes.com";
    }

    @GetMapping("/test-db")
    @ResponseBody
    public String testDatabase() {
        try {
            String result = jdbcTemplate.queryForObject(
                "SELECT version()",
                String.class
            );
            return "Database connection successful! PostgreSQL version: " + result;
        } catch (Exception e) {
            return "Database connection failed! Error: " + e.getMessage();
        }
    }

    // @GetMapping("/create-test-user")
    // @ResponseBody
    // public String createTestUser() {
    //     try {
    //         User testUser = new User();
    //         testUser.setId("test1");
    //         testUser.setUserName("testuser");
    //         testUser.setPassword("password123");
    //         testUser.setEmail("test@example.com");
    //         testUser.setPhoneNumber("1234567890");
    //         testUser.setIsAdmin(false);
            
    //         User createdUser = userService.createUser(testUser);
    //         return "Test user created successfully! User ID: " + createdUser.getId();
    //     } catch (Exception e) {
    //         return "Failed to create test user! Error: " + e.getMessage();
    //     }
    // }
} 