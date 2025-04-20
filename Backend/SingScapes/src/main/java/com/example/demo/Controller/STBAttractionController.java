package com.example.demo.Controller;

import com.example.demo.DTO.STBAttractionResponse;
import com.example.demo.Service.STBClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/external")
public class STBAttractionController {

    @Autowired
    private STBClientService stbClientService;

    @GetMapping("/stb-attractions")
    public ResponseEntity<?> getAttractions(@RequestParam(defaultValue = "10") int limit,
                                            @RequestParam(defaultValue = "1") int page) {
        return ResponseEntity.ok(stbClientService.fetchAttractions(limit, page));
    }
}
