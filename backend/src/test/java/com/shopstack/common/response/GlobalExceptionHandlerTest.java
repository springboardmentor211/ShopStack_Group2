package com.shopstack.common.response;

import com.shopstack.common.exception.ConflictException;
import com.shopstack.common.exception.ResourceNotFoundException;
import com.shopstack.common.exception.UnprocessableException;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    void resourceNotFoundMapsTo404() {
        ResponseEntity<ApiResponse> response =
                handler.handleNotFound(new ResourceNotFoundException("Shipment not found."));

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("Shipment not found.", response.getBody().getMessage());
    }

    @Test
    void conflictMapsTo409() {
        ResponseEntity<ApiResponse> response =
                handler.handleConflict(new ConflictException("This shipment is already in inventory."));

        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        assertEquals("This shipment is already in inventory.", response.getBody().getMessage());
    }

    @Test
    void unprocessableMapsTo422() {
        ResponseEntity<ApiResponse> response =
                handler.handleUnprocessable(new UnprocessableException("Choose a valid bin for this warehouse."));

        assertEquals(HttpStatus.UNPROCESSABLE_ENTITY, response.getStatusCode());
        assertEquals("Choose a valid bin for this warehouse.", response.getBody().getMessage());
    }

    @Test
    void unexpectedExceptionMapsTo500WithoutLeakingDetails() {
        ResponseEntity<ApiResponse> response =
                handler.handleGeneric(new IllegalStateException("connection pool exhausted at /secret/path"));

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Internal server error", response.getBody().getMessage());
    }
}