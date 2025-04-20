package com.example.demo.Entity.api;

import lombok.Data;

@Data
public class HawkerCentre {
    private String nameOfCentre;
    private String locationOfCentre;
    private String typeOfCentre;
    private String owner;
    private int noOfStalls;
    private int noOfCookedFoodStalls;
    private int noOfMktProduceStalls;
    private double latitude;
    private double longitude;
}
