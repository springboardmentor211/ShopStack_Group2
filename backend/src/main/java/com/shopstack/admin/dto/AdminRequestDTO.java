
package com.shopstack.admin.dto;

public class AdminRequestDTO {

    private String name;
    private String email;

    // Default constructor
    public AdminRequestDTO() {
    }

    // Parameterized constructor
    public AdminRequestDTO(String name, String email) {
        this.name = name;
        this.email = email;
    }

    // Getter for name
    public String getName() {
        return name;
    }

    // Setter for name
    public void setName(String name) {
        this.name = name;
    }

    // Getter for email
    public String getEmail() {
        return email;
    }

    // Setter for email
    public void setEmail(String email) {
        this.email = email;
    }
}
