package com.example.demo.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Entity.Attraction;
import com.example.demo.Entity.Partner;
import com.example.demo.Service.AttractionService;

import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/attractions")
public class AttractionController {

    @Autowired
    private final AttractionService attractionService;

    public AttractionController(AttractionService attractionService) {
         this.attractionService = attractionService;
    }

    @PostMapping
    public ResponseEntity<Attraction> createAttraction(@RequestBody Attraction attraction){
         Attraction createdAttraction = attractionService.createAttraction(attraction);

         System.out.println("Saving Attraction: " + attraction); // Debugging log

         return new ResponseEntity<>(createdAttraction, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Attraction> getAttractionById(@PathVariable UUID id) {
        Attraction attraction = attractionService.geAttractionById(id);
        if (attraction != null) {
            return new ResponseEntity<>(attraction, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping
    public ResponseEntity<List<Attraction>> getAllAttractions() {
        List<Attraction> attractions = attractionService.getAllAttractions();
        return new ResponseEntity<>(attractions, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAttraction(@PathVariable UUID id){
        attractionService.deleteAttraction(id);
        return new ResponseEntity<>(HttpStatus.FOUND);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateAttraction(@PathVariable UUID id, @RequestBody Attraction attraction)
    {
        attractionService.updateAttraction(id, attraction);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
