package com.example.demo.Controller;

import com.example.demo.Entity.User;
import com.example.demo.Repository.UserRepository;
import com.example.demo.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        
        return ResponseEntity.ok(userService.saveUser(user));
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.findAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable UUID id) {
        return userService.findUserById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable UUID id, @RequestBody User userDetails) {
        return userService.findUserById(id)
                .map(user -> {
                    
                    user.setEmail(userDetails.getEmail() != null ? userDetails.getEmail() : user.getEmail());
                    user.setFull_name(userDetails.getFull_name() != null ? userDetails.getFull_name() : user.getFull_name());
                    user.setPhone_number(userDetails.getPhone_number() != null ? userDetails.getPhone_number() : user.getPhone_number());
                    user.setIs_admin(userDetails.getIs_admin() != null ? userDetails.getIs_admin() : user.getIs_admin());
                    user.setBookingIds(userDetails.getBookingIds() != null ? userDetails.getBookingIds() : user.getBookingIds());
                    return ResponseEntity.ok(userService.updateUser(user));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        return userService.findUserById(id)
                .map(user -> {
                    userService.deleteUser(id);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PatchMapping("/ban/{id}")
    public ResponseEntity<?> BanUser(@PathVariable UUID id)
    {
        Optional<User> bannedUser = userService.banUser(id);
        return bannedUser.map(ResponseEntity::ok).orElseGet(()-> ResponseEntity.notFound().build());
    }
}
