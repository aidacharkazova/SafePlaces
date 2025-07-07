package com.example.safeplaces.controller;

import com.example.safeplaces.model.Location;
import com.example.safeplaces.service.LocationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/locations")
public class LocationController {

    private final LocationService locationService;

    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Location> getById(@PathVariable String id) {
         return ResponseEntity.ok(locationService.getByLocationId(id));
    }

    @GetMapping
    public ResponseEntity<List<Location>> searchLocation(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) String address) {
        return ResponseEntity.ok(locationService.searchLocation(type, minRating, address));
    }


    @PostMapping
    public ResponseEntity<Location> createLocation(@RequestBody @Valid Location location) {
        Location createdLocation = locationService.createLocation(location);
        URI locationUri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(createdLocation.getId())
                .toUri();
        return ResponseEntity.created(locationUri).body(createdLocation);
    }

}
