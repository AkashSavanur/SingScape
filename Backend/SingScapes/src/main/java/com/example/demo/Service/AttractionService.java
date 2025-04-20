package com.example.demo.Service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Entity.Attraction;
import com.example.demo.Repository.AttractionRepository;


@Service
public class AttractionService {

    @Autowired
    private final AttractionRepository attractionRepository;

    public AttractionService(AttractionRepository attractionRepository){

        this.attractionRepository = attractionRepository;
    }

    public Attraction createAttraction(Attraction attraction) {

        

        return attractionRepository.save(attraction);
    }

    public List<Attraction> getAllAttractions() {

        return attractionRepository.findAll();
    }

    public Attraction geAttractionById(UUID id) {
        System.out.println("Fetching attraction with ID: " + id);  // Log the attraction ID being fetched
        return attractionRepository.findById(id).orElseThrow(() -> new RuntimeException("Attraction not found with ID: " + id));
    }

    public Attraction updateAttraction(UUID id, Attraction attractionDetails) {

        Attraction existingAttraction = geAttractionById(id);

        existingAttraction.setDescription(attractionDetails.getDescription());
        existingAttraction.setLocation(attractionDetails.getLocation());
        existingAttraction.setName(attractionDetails.getName());
        existingAttraction.setPostal(attractionDetails.getPostal());
        existingAttraction.setRating(attractionDetails.getRating());
        existingAttraction.setType(attractionDetails.getType());

        return attractionRepository.save(existingAttraction);
    }

    public void deleteAttraction(UUID id) {

        if(!attractionRepository.existsById(id)) {
            throw new RuntimeException("Cannot delete. Attraction not found with ID: " + id);
        }

        attractionRepository.deleteById(id);
    }


    
}
