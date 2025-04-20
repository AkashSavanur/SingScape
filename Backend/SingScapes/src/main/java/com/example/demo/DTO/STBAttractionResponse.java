package com.example.demo.DTO;

import lombok.Data;
import java.util.List;

@Data
public class STBAttractionResponse {
    private List<AttractionItem> data;

    @Data
    public static class AttractionItem {
        private String name;
        private String description;
        private List<String> images;
        private String address;
        private String businessHour;
        private String contact;
    }
}
