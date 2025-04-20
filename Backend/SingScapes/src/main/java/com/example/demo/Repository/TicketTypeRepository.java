package com.example.demo.Repository;

import com.example.demo.Entity.TicketType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TicketTypeRepository extends JpaRepository<TicketType, UUID> {
    List<TicketType> findByAttraction_Id(UUID attractionId);
    Optional<TicketType> findByAttraction_IdAndTypeAndPrice(UUID attractionId, String type, String price);
    Optional<TicketType> findByAttraction_IdAndType(UUID attractionId, String type);


}
