package com.example.demo.Service;

import com.example.demo.Entity.Partner;
import com.example.demo.Repository.PartnerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PartnerService {

    @Autowired
    private PartnerRepository partnerRepository;

    public Partner createPartner(Partner partner) {
        return partnerRepository.save(partner);
    }

    public List<Partner> getAllPartners() {
        return partnerRepository.findAll();
    }

    public Optional<Partner> getPartnerById(UUID id) {
        return partnerRepository.findById(id);
    }

    public void deletePartner(UUID id) {
        partnerRepository.deleteById(id);
    }

    public Partner updatePartner(UUID id, Partner updatedPartner) {
        return partnerRepository.findById(id).map(partner -> {
            partner.setName(updatedPartner.getName());
            partner.setEmail(updatedPartner.getEmail());
            partner.setPhone(updatedPartner.getPhone());
            partner.setOrganization(updatedPartner.getOrganization());
            partner.setWebsite(updatedPartner.getWebsite());
            partner.setPartnershipType(updatedPartner.getPartnershipType());
            partner.setStatus(updatedPartner.getStatus());
            return partnerRepository.save(partner);
        }).orElseThrow(() -> new RuntimeException("Partner not found"));
    }
}
