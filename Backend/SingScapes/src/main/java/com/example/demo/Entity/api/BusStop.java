package com.example.demo.Entity.api;

import lombok.Data;

@Data
public class BusStop {
    private String busStopCode;
    private String roadName;
    private String description;
    private double latitude;
    private double longitude;
}
